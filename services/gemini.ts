import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkOpenEndedAnswer = async (question: string, userAnswer: string, context: string): Promise<{ feedback: string; score: number }> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `
      Context: The student is studying an English textbook (B1+ level). 
      Topic: "${context}".
      Question: "${question}"
      Student Answer: "${userAnswer}"
      
      Task: Act as a supportive CELTA-trained English teacher. 
      1. Give brief, encouraging feedback (max 2 sentences).
      2. Correct any major grammar errors gently.
      3. Rate the relevance of the answer from 1-10.
      
      Output JSON format: { "feedback": string, "score": number }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error", error);
    return { feedback: "Good effort! (AI currently unavailable for detailed feedback)", score: 5 };
  }
};
