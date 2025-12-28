import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const AI_AGENT = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const geminiHelp = async (source_code, problem) => {

    const systemInstruction = `You are an expert competitive programming coach. 
    Your goal is to help users debug their code without giving away the full answer immediately. 
    Analyze the provided problem and code, then provide:
    1. A hint about the logic error.
    2. Complexity analysis.
    3. Advice on edge cases.
    4. If users ask questions outside the knowledge or your role as a coding agent or assistant just tell that you are not aware.
    Keep it concise and professional. Do not go off topic. Greet the user and behave professionally.
    5. Motivate the user about the current code and also rate his code quality out of 10 with 10 being best and 1 being least
    `;

    const prompt = `
    Problem Title: ${problem.title}
    Difficulty: ${problem.difficulty}
    Description: ${problem.description}
    Topics: ${problem.topicsList?.join(", ")}
    Constraints: ${problem.constraints?.join(", ")}
    Expected Complexity: Time: ${problem.expectedTimeComplexity}, Space: ${problem.expectedSpaceComplexity}
    
    User's Current Code:
    \`\`\`
    ${source_code}
    \`\`\`
    
    Identify potential bugs or optimizations based on the problem description.`;

    try {
        const result = await AI_AGENT.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                systemInstruction: systemInstruction,
                safetySettings: [
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' }
                ],
                thinkingConfig: { include_thoughts: false }
            }
        })

        if (!result) {
            console.error("Gemini SDK returned an empty result object : ", result);
            return null;
        }

        return result

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}