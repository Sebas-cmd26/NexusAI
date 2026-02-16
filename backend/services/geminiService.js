import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    let fullMessage = message;
    if (context) {
      fullMessage = `Context about the article we're discussing:\n${context}\n\nUser question: ${message}`;
    }

    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw new Error("I am currently unable to process your request. Please try again.");
  }
};
