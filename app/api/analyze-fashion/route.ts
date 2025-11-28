import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import sharp from "sharp";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type BoundingBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type RelatedProduct = {
	title: string;
	price: string;
	image?: string;
	url?: string;
};

type FashionItem = {
	name: string;
	category: string;
	color: string;
	material: string;
	brand: string;
	price: string;
	matchScore: number;
	boundingBox: BoundingBox;
	searchQuery: string;
	relatedProducts?: RelatedProduct[];
	croppedImage?: string | null;
};

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("image") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No image provided" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Use Gemini 2.5 Flash for fast analysis
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const _prompt = `
You are a fashion expert and product tagging system.

Analyze this fashion image and identify the key clothing items.
For each item, extract:

- name: A short human-friendly name (e.g., "Leather Biker Jacket").
- category: One of ["top", "bottom", "dress", "outerwear", "shoes", "bag", "accessory", "other"].
- color: Main visible color(s) in simple terms (e.g., "black", "beige", "navy").
- material: Best-guess main material (e.g., "leather", "denim", "cotton", "wool", "synthetic").
- brand: Best guess, or "Unknown" if you are not confident.
- price: Estimated retail price in USD as a string (e.g., "$120").
- matchScore: Confidence that this item is a key fashion item in the image (0–100).
- boundingBox: A TIGHT bounding box around ONLY this item, as an object { "x": number, "y": number, "width": number, "height": number }.

  IMPORTANT BOUNDING BOX RULES:
  - x, y are the TOP-LEFT corner of the box.
  - width, height are the SIZE of the box.
  - ALL values MUST be normalized between 0 and 1 relative to the full image width/height.
    - x = left_pixel / image_width
    - y = top_pixel / image_height
    - width = box_pixel_width / image_width
    - height = box_pixel_height / image_height
  - The box should be as tight as possible:
  - Follow the category-specific constraints listed in "ADDITIONAL BOUNDING BOX GUIDELINES" below when applicable.
    - Include the entire item (e.g., pants: waist → hem; shoes: only shoes, minimal floor).
    - Do NOT include unrelated background or other items.
  - The box MUST stay inside the image:
    - 0 <= x <= 1
    - 0 <= y <= 1
    - 0 < width <= 1 - x
    - 0 < height <= 1 - y
  - If the item is partially cut off, include only the visible region.
  - Prefer 3 decimal places for values.

ADDITIONAL BOUNDING BOX GUIDELINES:
- For the main outfit on a single person:
  - "top": from the shoulder line down to the bottom hem of the top. Do NOT include more than a small part of the head or the pants.
  - "bottom": from the waist/hip line down to the hem of both legs. Do NOT include the shoes inside the "bottom" box.
  - "shoes": tightly include only the shoes and a small margin. You may include a little ankle/pants and a very thin strip of floor, but do NOT include the knees or a large portion of the legs.
  - "bag": include the entire bag body and the full handle, even if this requires a bit of extra background above the handle.
  - Neck "scarf" or neck accessory: focus on the neck/chest area where the scarf sits. Avoid including a large portion of the face or hair.
- If multiple people appear, focus on the main centered person.
- Never output extremely large boxes such as [0,0,1,1] unless the item truly fills nearly the entire frame.
- Do NOT group multiple categories into one box (for example, the "bottom" box must not include the shoes, and the "top" box must not include most of the legs).
- If multiple people appear, focus on the main centered person.
- Never output extremely large boxes such as [0,0,1,1] unless the item truly fills nearly the entire frame.

Return ONLY a valid JSON object with this exact structure:

{
  "items": [
    {
      "name": "string",
      "brand": "string",
      "price": "string",
      "matchScore": number,
      "category": "string",
      "color": "string",
      "material": "string",
      "boundingBox": {
      },
      "searchQuery": "string"
    }
  ]
}

Do not include any markdown, explanations, or extra text. Only return the JSON.
`;

		const result = await model.generateContent([
			_prompt,
			{
				inlineData: {
					data: buffer.toString("base64"),
					mimeType: file.type,
				},
			},
		]);

		const response = await result.response;
		const text = response.text();
		console.log("Gemini raw text:", text);
		// Clean up markdown code blocks if present
		const jsonStr = text.replace(/```json\n?|\n?```/g, "").trim();

		let data: { items: FashionItem[] };
		try {
			data = JSON.parse(jsonStr);
		} catch (parseError) {
			console.error("Failed to parse Gemini JSON:", parseError, "raw:", text);
			return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
		}

		const items = Array.isArray(data.items) ? data.items : [];

		const meta = await sharp(buffer).metadata();
		const imageWidth = meta.width ?? 1;
		const imageHeight = meta.height ?? 1;

		const croppedItems: FashionItem[] = [];

		for (const item of items) {
			let { x, y, width, height } = item.boundingBox;

			// If the model returned normalized values (0–1), convert to pixel coordinates.
			// Heuristic: if width/height are <= 1, we treat them as normalized.
			if (width <= 1 && height <= 1) {
				const leftPx = Math.round(x * imageWidth);
				const topPx = Math.round(y * imageHeight);
				const widthPx = Math.round(width * imageWidth);
				const heightPx = Math.round(height * imageHeight);

				x = leftPx;
				y = topPx;
				width = widthPx;
				height = heightPx;
			}

			// Clamp to image bounds to avoid extract errors
			const left = Math.max(0, Math.min(x, imageWidth - 1));
			const top = Math.max(0, Math.min(y, imageHeight - 1));
			const maxWidth = imageWidth - left;
			const maxHeight = imageHeight - top;
			const cropWidth = Math.max(1, Math.min(width, maxWidth));
			const cropHeight = Math.max(1, Math.min(height, maxHeight));

			try {
				const croppedBuffer = await sharp(buffer)
					.extract({
						left,
						top,
						width: cropWidth,
						height: cropHeight,
					})
					.toFormat("png")
					.toBuffer();

				item.croppedImage = `data:image/png;base64,${croppedBuffer.toString("base64")}`;
			} catch (cropError) {
				console.error("Failed to crop item image:", cropError, {
					box: { left, top, width: cropWidth, height: cropHeight },
					imageWidth,
					imageHeight,
				});
				item.croppedImage = null;
			}

			croppedItems.push({
				...item,
				relatedProducts: item.relatedProducts ?? [],
			});
		}

		return NextResponse.json({ items: croppedItems });
	} catch (error) {
		console.error("Error analyzing fashion:", error);
		return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
	}
}
