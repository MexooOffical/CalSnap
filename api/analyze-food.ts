import { GoogleGenAI, Type } from "@google/genai";
import { getIntelligentFoodProfile } from "../src/services/nutritionIntelligence";

let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Support CORS and preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { imageBase64, mimeType = "image/jpeg", userHint = "" } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({
        error: "Missing image data. Please provide base64 image.",
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
    const ai = getGemini();

    if (!ai) {
      console.log("No GEMINI_API_KEY detected in Vercel function, using local profile.");
      const fallback = getIntelligentFoodProfile(userHint);
      return res.status(200).json({
        ...fallback,
        isSimulation: true,
      });
    }

    const systemPrompt = `You are a clinical nutritionist and computer vision expert specializing in Indian cuisine (Maharashtrian, South Indian, North Indian, Gujarati, Bengali, street food, snacks).
Accurately identify all foods, estimate portion weights in grams, calculate realistic calories, protein, carbs, fat, and fiber based on ICMR standards. Return valid JSON adhering to the schema.`;

    const promptText = `Identify the food in this image and provide accurate calorie and macronutrient breakdown. ${
      userHint ? `User description / hint: "${userHint}"` : ""
    }`;

    const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"];
    let responseText: string | undefined;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: cleanBase64,
              },
            },
            promptText,
          ],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mealTitle: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                isUncertain: { type: Type.BOOLEAN },
                alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                foodItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      estimatedServing: { type: Type.STRING },
                      servingUnit: { type: Type.STRING },
                      estimatedWeightGrams: { type: Type.NUMBER },
                      calories: { type: Type.NUMBER },
                      proteinGrams: { type: Type.NUMBER },
                      carbsGrams: { type: Type.NUMBER },
                      fatGrams: { type: Type.NUMBER },
                      fiberGrams: { type: Type.NUMBER },
                      regionalOrigin: { type: Type.STRING },
                    },
                    required: [
                      "name",
                      "estimatedServing",
                      "estimatedWeightGrams",
                      "calories",
                      "proteinGrams",
                      "carbsGrams",
                      "fatGrams",
                    ],
                  },
                },
                totalCalories: { type: Type.NUMBER },
                totalProtein: { type: Type.NUMBER },
                totalCarbs: { type: Type.NUMBER },
                totalFat: { type: Type.NUMBER },
                totalFiber: { type: Type.NUMBER },
                insightTip: { type: Type.STRING },
              },
              required: [
                "mealTitle",
                "confidence",
                "foodItems",
                "totalCalories",
                "totalProtein",
                "totalCarbs",
                "totalFat",
              ],
            },
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (e: any) {
        console.warn(`Vercel function model ${model} error:`, e.message);
      }
    }

    if (!responseText) {
      const fallback = getIntelligentFoodProfile(userHint);
      return res.status(200).json({
        ...fallback,
        isSimulation: true,
      });
    }

    const parsed = JSON.parse(responseText.trim());
    return res.status(200).json({
      ...parsed,
      isSimulation: false,
    });
  } catch (err: any) {
    console.error("Vercel API error:", err);
    const fallback = getIntelligentFoodProfile(req?.body?.userHint || "");
    return res.status(200).json({
      ...fallback,
      isSimulation: true,
    });
  }
}
