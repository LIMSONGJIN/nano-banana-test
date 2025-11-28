import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image, query } = await req.json();

        if (!image && !query) {
            return NextResponse.json({ error: "Image or query is required" }, { status: 400 });
        }

        // In a real production scenario with GCP Vision Product Search:
        // 1. Authenticate with Google Cloud credentials.
        // 2. Call the Vision API Product Search endpoint with the image.
        // 3. Return the matched product results from the indexed catalog.

        // For this demo/prototype without a pre-indexed catalog:
        // We will use Gemini to generate "simulated" product recommendations based on the image analysis.
        // This provides a realistic user experience of what the feature would look like.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an AI fashion shopping assistant.
      Analyze the provided fashion item image (or search query: "${query}").
      
      Generate a list of 4-6 REALISTIC similar fashion products that someone might want to buy.
      For each product, provide:
      1. Title (Brand + Item Name)
      2. Price (in USD)
      3. Image URL (Use realistic placeholder URLs from Unsplash or similar that match the description)
      4. Purchase URL (Mock URL)
      
      Return ONLY a valid JSON object with this structure:
      {
        "products": [
          {
            "title": "string",
            "price": "string",
            "imageUrl": "string",
            "purchaseUrl": "string"
          }
        ]
      }

      For the Image URLs, use these specific Unsplash IDs for realism if they match the category:
      - Jacket/Coat: photo-1551028919-ac6635f0e5c9, photo-1544923246-77307dd654cb
      - Top/Shirt: photo-1521572163474-6864f9cf17ab, photo-1618354691373-d851c5c3a990
      - Pants/Jeans: photo-1542272454315-4c01d7abdf4a, photo-1584370848010-d7d6ac627ed8
      - Shoes: photo-1549298916-b41d501d3772, photo-1560769629-975ec94e6a86
      - Bag: photo-1584917865442-de89df76afd3, photo-1590874103328-eac38a683ce7
      
      Select the most appropriate images or use other high-quality fashion images.
    `;

        let parts: any[] = [{ text: prompt }];

        if (image) {
            // image is expected to be a base64 string (data:image/png;base64,...)
            const match = image.match(/^data:(.*?);base64,(.*)$/);
            if (match) {
                parts.push({
                    inlineData: {
                        mimeType: match[1],
                        data: match[2],
                    },
                });
            }
        }

        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json\n|\n```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Product search error:", error);
        return NextResponse.json(
            { error: "Failed to search products" },
            { status: 500 }
        );
    }
}
