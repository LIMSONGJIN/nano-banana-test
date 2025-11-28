import { GoogleGenerativeAI, type GenerateContentRequest } from "@google/generative-ai";
import { NextResponse } from "next/server";

const _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const personImage = formData.get("personImage") as File | null;
		const garmentImage = formData.get("garmentImage") as File | null;

		// Collect all item_* entries (thumbnail or cropped outfit images)
		const itemKeys = Array.from(formData.keys()).filter((key) => key.startsWith("item_"));

		console.log("[VTO Debug] FormData Keys:", Array.from(formData.keys()));
		console.log("[VTO Debug] personImage:", personImage ? `Present (${personImage.size} bytes, type: ${personImage.type})` : "Missing");
		console.log("[VTO Debug] garmentImage:", garmentImage ? `Present (${garmentImage.size} bytes, type: ${garmentImage.type})` : "Missing");
		console.log("[VTO Debug] itemKeys:", itemKeys);

		if (!personImage) {
			return NextResponse.json({ error: "personImage is required" }, { status: 400 });
		}

		if (!garmentImage && itemKeys.length === 0) {
			return NextResponse.json(
				{ error: "At least one clothing image is required (garmentImage or item_0, item_1, ...)" },
				{ status: 400 }
			);
		}

		const personBytes = await personImage.arrayBuffer();
		const personBuffer = Buffer.from(personBytes);

		// Convert to base64 for Gemini inlineData (base person)
		const personBase64 = personBuffer.toString("base64");

		const prompt = `You are an expert AI for virtual try-on.
TASK: Generate a NEW image of the person from IMAGE 1 wearing the outfit from IMAGE 2 (and subsequent images).

INPUTS:
- IMAGE 1: TARGET MODEL (The person who will be wearing the clothes).
- IMAGE 2+: CLOTHING ITEMS (The clothes to be transferred).

CRITICAL INSTRUCTIONS:
1. **TARGET**: You MUST use the person and pose from IMAGE 1.
2. **OUTFIT**: Transfer the clothing items from IMAGE 2+ onto the person in IMAGE 1.
3. **OUTPUT**: A high-quality photorealistic image of the person from IMAGE 1 wearing the new outfit.

DO NOT simply return any of the input images.
DO NOT change the identity or pose of the person in IMAGE 1.
DO NOT change the aspect ratio or composition. The output MUST match the dimensions and framing of IMAGE 1 exactly.
The result must look like the person in IMAGE 1 changed their clothes.`;

		const model = _genAI.getGenerativeModel({
			model: "gemini-3-pro-image-preview",
		});

		// Build parts: base person image, then all clothing item images (thumbnails / cropped outfit images), then prompt
		const parts: unknown[] = [];

		// IMAGE 1 — base person
		parts.push({
			inlineData: {
				data: personBase64,
				mimeType: personImage.type || "image/jpeg",
			},
		});

		// Optional garmentImage as an additional clothing reference (if provided as a File)
		if (garmentImage) {
			const garmentBytes = await garmentImage.arrayBuffer();
			const garmentBuffer = Buffer.from(garmentBytes);
			const garmentBase64 = garmentBuffer.toString("base64");

			parts.push({
				inlineData: {
					data: garmentBase64,
					mimeType: garmentImage.type || "image/jpeg",
				},
			});
		}

		// item_0, item_1, ... — may come from the client as data URLs (thumbnailImage or croppedImage)
		for (const key of itemKeys) {
			const value = formData.get(key);
			if (!value) continue;

			// If sent as a File, convert like the others
			if (value instanceof File) {
				const bytes = await value.arrayBuffer();
				const buffer = Buffer.from(bytes);
				const base64 = buffer.toString("base64");

				parts.push({
					inlineData: {
						data: base64,
						mimeType: value.type || "image/png",
					},
				});
			} else if (typeof value === "string") {
				// If sent as a data URL string, parse "data:mime;base64,...."
				const match = value.match(/^data:(.*?);base64,(.*)$/);
				if (!match) {
					continue;
				}
				const mimeType = match[1] || "image/png";
				const base64 = match[2];

				parts.push({
					inlineData: {
						data: base64,
						mimeType,
					},
				});
			}
		}

		// Finally, add the text prompt
		parts.push({ text: prompt });

		const genResult = await model.generateContent({
			contents: [
				{
					role: "user",
					parts,
				},
			],
		} as GenerateContentRequest);

		// Extract generated image (base64) from Gemini response
		const candidate = genResult.response.candidates?.[0];
		const partsResp = candidate?.content?.parts || [];

		let imageData: string | undefined;
		let imageMimeType = "image/png";

		for (const part of partsResp) {
			if (part.inlineData?.data) {
				imageData = part.inlineData.data;
				if (part.inlineData.mimeType) {
					imageMimeType = part.inlineData.mimeType;
				}
				break;
			}
		}

		if (!imageData) {
			console.error("Gemini virtual-fitting: no inlineData image returned", genResult);
			return NextResponse.json({ error: "Failed to generate virtual try-on image" }, { status: 502 });
		}

		const dataUrl = `data:${imageMimeType};base64,${imageData}`;

		return NextResponse.json({
			success: true,
			message: "Virtual Try-On completed successfully",
			resultImageDataUrl: dataUrl,
		});
	} catch (error) {
		console.error("Error processing virtual try-on:", error);
		return NextResponse.json({ error: "Failed to process virtual try-on" }, { status: 500 });
	}
}
