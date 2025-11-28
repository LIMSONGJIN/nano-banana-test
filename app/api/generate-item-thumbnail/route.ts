import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
	console.warn("[generate-item-thumbnail] GEMINI_API_KEY is not set. The API will return 500 for requests.");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * POST /api/generate-item-thumbnail
 *
 * Request body (JSON):
 * {
 *   "croppedImage": "data:image/png;base64,....", // required
 *   "name": "Paris Graphic Sweatshirt",          // optional
 *   "category": "top",                           // optional
 *   "color": "navy blue"                         // optional
 * }
 *
 * Response (JSON):
 * {
 *   "success": true,
 *   "thumbnailImage": "data:image/png;base64,...."
 * }
 */
export async function POST(request: NextRequest) {
	try {
		if (!apiKey) {
			return NextResponse.json(
				{
					success: false,
					error: "AI service not configured",
					message: "GEMINI_API_KEY is missing.",
				},
				{ status: 500 }
			);
		}

		const body = await request.json().catch(() => null);

		const dataUrl: string | undefined = body.croppedImage || body.image;
		const name: string | undefined = body.name;
		const category: string | undefined = body.category;
		const color: string | undefined = body.color;
		const searchQuery: string | undefined = body.searchQuery;

		if (!body || (!dataUrl && !searchQuery)) {
			return NextResponse.json(
				{
					success: false,
					error: "Invalid request body",
					message: "Expected JSON with 'croppedImage'/'image' OR 'searchQuery'.",
				},
				{ status: 400 }
			);
		}

		const model = genAI.getGenerativeModel({
			model: "gemini-3-pro-image-preview",
		});

		let prompt = "";
		let inlineDataParts: Part[] = [];

		if (dataUrl) {
			// IMAGE-TO-IMAGE GENERATION
			const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
			if (!match) {
				return NextResponse.json(
					{
						success: false,
						error: "Invalid image format",
						message: "Image must be a data URL (data:image/...;base64,...)",
					},
					{ status: 400 }
				);
			}

			const mimeType = match[1] || "image/png";
			const b64Data = match[2];

			const itemLabelParts: string[] = [];
			if (category) itemLabelParts.push(category);
			if (color) itemLabelParts.push(color);
			if (name) itemLabelParts.push(name);

			const itemLabel = itemLabelParts.length > 0 ? itemLabelParts.join(" / ") : "clothing item";

			prompt = `You are an expert AI fashion photographer and product retoucher.

TASK: Convert the clothing shown in the image into a clean e-commerce product thumbnail.

SOURCE IMAGE:
- The input image contains a clothing item that is currently worn on a person or partially visible.
- Your job is to isolate ONLY the clothing item and regenerate it as a standalone product photo.

CLOTHING ITEM:
- Treat the item as: ${itemLabel}
- Preserve the design, color, pattern, and material as accurately as possible.
- Do NOT change the style or overall silhouette of the item.

OUTPUT REQUIREMENTS:
- Show ONLY the clothing item (no person, no body parts, no face, no hair).
- Use a clean, simple background (solid light or neutral color, e.g., white or very light gray).
- Center the clothing item in the frame, well-lit and sharp.
- Professional e-commerce style product shot.
- Natural shadows and subtle reflections allowed, but no busy environment.
- No logos, text overlays, or watermarks that were not in the original garment.

DO NOT:
- Do not include any part of the original model's body (no hands, legs, face, neck, etc.).
- Do not add additional accessories that were not in the original crop.
- Do not change the color or design of the garment.
- Do not crop the item awkwardly; it should be fully visible and easy to recognize.

RESULT:
Return a single high-quality product thumbnail image of the clothing item, isolated on a clean background, ready to be used as an e-commerce product thumbnail.`;

			inlineDataParts = [
				{
					inlineData: {
						mimeType,
						data: b64Data,
					},
				},
			];
		} else {
			// TEXT-TO-IMAGE GENERATION (Fallback)
			const itemDescription = searchQuery || `${color || ""} ${category || ""} ${name || ""}`.trim();

			prompt = `You are an expert AI fashion designer and photographer.

TASK: Generate a high-quality e-commerce product thumbnail for a fashion item based on the description.

ITEM DESCRIPTION:
${itemDescription}

OUTPUT REQUIREMENTS:
- Show ONLY the clothing item (no person, no body parts, no face, no hair).
- Use a clean, simple background (solid light or neutral color, e.g., white or very light gray).
- Center the clothing item in the frame, well-lit and sharp.
- Professional e-commerce style product shot.
- Natural shadows and subtle reflections allowed.

RESULT:
Return a single high-quality product thumbnail image of the described item.`;
		}

		const result = await model.generateContent({
			contents: [
				{
					role: "user",
					parts: [...inlineDataParts, { text: prompt }],
				},
			],
		});

		const candidate = result.response.candidates?.[0];
		const parts = candidate?.content?.parts || [];

		let outBase64: string | undefined;
		let outMimeType = "image/png";

		for (const part of parts) {
			if (part.inlineData?.data) {
				outBase64 = part.inlineData.data;
				if (part.inlineData.mimeType) {
					outMimeType = part.inlineData.mimeType;
				}
				break;
			}
		}

		if (!outBase64) {
			console.error("[generate-item-thumbnail] No inlineData image returned", JSON.stringify(result, null, 2));
			return NextResponse.json(
				{
					success: false,
					error: "No image generated",
					message: "AI did not return an image.",
				},
				{ status: 502 }
			);
		}

		const outDataUrl = `data:${outMimeType};base64,${outBase64}`;

		return NextResponse.json({
			success: true,
			thumbnailImage: outDataUrl,
		});
	} catch (err) {
		console.error("[generate-item-thumbnail] Unexpected error:", err);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
				message: err instanceof Error ? err.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
