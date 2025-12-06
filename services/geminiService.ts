import { GoogleGenAI, Type } from "@google/genai";
import { AgentApplication, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeApplicantPotential = async (app: AgentApplication): Promise<AnalysisResult> => {
  try {
    const prompt = `
      你是一位专业的 PQG1314 品牌招商经理。你需要分析一位想加入代理团队的申请者。
      我们的产品生态非常丰富，包括：保健品、护肤品、日常用品、咖啡、可可、姜茶、新年饼以及未来持续开发的新项目。
      
      申请者资料:
      姓名: ${app.name}
      地区: ${app.location}
      加入原因/动力: ${app.reason}
      目标收入: ${app.incomeGoal}

      请以 JSON 格式回复，包含以下字段：
      1. "score" (整数 0-100): 根据他的野心和动力打分。
      2. "feedback" (字符串): 用中文给出一句简短、有煽动性且鼓励的话（不要超过30个字），针对他的收入目标进行肯定。
      3. "suggestedRole" (字符串): 建议的定位（例如：初级合伙人、核心代理、团队领导、品牌大使）。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            suggestedRole: { type: Type.STRING }
          },
          required: ["score", "feedback", "suggestedRole"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      score: 88,
      feedback: "您的目标非常清晰，PQG1314 的丰富产品线绝对能帮您达成！",
      suggestedRole: "潜能核心代理"
    };
  }
};