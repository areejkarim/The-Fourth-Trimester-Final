
import { GoogleGenAI } from "@google/genai";
import { UserProfile, DailyCheckIn } from "../types";

const MEDICAL_SOURCES = [
  "pubmed.ncbi.nlm.nih.gov",
  "cdc.gov",
  "who.int",
  "cochranelibrary.com",
  "nice.org.uk",
  "nih.gov",
  "bmj.com",
  "jamanetwork.com"
];

const SYSTEM_INSTRUCTION = `
You are a warm, compassionate postpartum companion for "The Fourth Trimester".
Your goal is to provide supportive, evidence-based recovery encouragement.

STRICT FORMATTING RULES:
1. NO BOLD TEXT: Do not use asterisks (*) or double asterisks (**) anywhere. 
2. NO MARKDOWN HEADERS: Do not use # or ##. Use plain text titles.
3. NO ASTERISKS: Do not use asterisks even for bullet points.
4. TASK LIST FORMAT: For daily tasks, start each line with "TASK:".
5. RECIPE FORMAT: For the recipe, start the line with "RECIPE:". Use simple, whole food ingredients.

STRICT SAFETY & TONE RULES:
1. NO DIAGNOSES: Never tell the mother she has a specific condition. Use phrases like "It is common to feel..." or "One possibility to explore is..."
2. NO TECHNICAL JARGON: Use simple, everyday words. 
3. PREVENT STRESS: Focus on small, comforting possibilities.
4. RAG SOURCE RULE: Prioritize info from: ${MEDICAL_SOURCES.join(", ")}.

RESPONSE STRUCTURE:
A Gentle Thought: (1-2 sentences of comfort)

RECIPE: (A 3-step whole food recipe focused on her symptoms, e.g. iron-rich if tired)

Daily Tasks:
TASK: (Tip 1)
TASK: (Tip 2)
TASK: (Tip 3)
`;

export const getPersonalizedInsights = async (profile: UserProfile, lastCheckIn: DailyCheckIn) => {
  const prompt = `
    Context:
    - Birth: ${profile.birthType}
    - Diagnoses: ${profile.diagnoses || 'None'}
    - Vitals: Happiness ${lastCheckIn.happiness}/5, Fatigue ${lastCheckIn.fatigue}/5, Pain ${lastCheckIn.pain}/5
    - Notes: "${lastCheckIn.notes || 'No notes.'}"
    
    Provide a warm insight, a simple recipe starting with RECIPE:, and exactly 3 checkable tasks starting with TASK:. 
    Do not use bold, do not use asterisks, do not diagnose.
  `;

  const tryRequest = async (model: string, useSearch: boolean) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    return await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        temperature: 0.3,
      },
    });
  };

  try {
    const response = await tryRequest("gemini-3-pro-preview", true);
    if (response.text) {
      return {
        text: response.text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      };
    }
    throw new Error("Empty response");
  } catch (err) {
    try {
      const response = await tryRequest("gemini-3-flash-preview", false);
      return {
        text: response.text || "I'm thinking of some gentle tips for you...",
        sources: []
      };
    } catch (err2) {
      return {
        text: "A Gentle Thought: You are doing a wonderful job. \nRECIPE: Simple Avocado Toast with hemp seeds for healthy fats.\nDaily Tasks:\nTASK: Drink a warm glass of water.\nTASK: Take three deep breaths.\nTASK: Rest for five minutes.",
        sources: []
      };
    }
  }
};
