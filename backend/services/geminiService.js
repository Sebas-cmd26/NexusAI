import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // User asked for gemini-pro but flash is faster/better for summary. Using available.

export const summarizeWithGemini = async (text) => {
  try {
    const prompt = `Summarize the following news text in 2-3 concise sentences. Focus on the key facts. Text: ${text.substring(0, 5000)}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return "Summary unavailable due to AI error.";
  }
};

export const chatWithGemini = async (history, message, context = "") => {
  try {
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemContext = context ? `Context: ${context}\n\n` : "";
    const fullMessage = `${systemContext}${message}`;

    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    return "I am currently unable to process your request.";
  }
};
