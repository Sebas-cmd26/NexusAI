import express from 'express';
import { summarizeWithGemini, chatWithGemini } from '../services/geminiService.js';

const router = express.Router();

// POST /api/summarize { text }
router.post('/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const summary = await summarizeWithGemini(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// POST /api/chat { history, message, context }
router.post('/chat', async (req, res) => {
  try {
    const { history, message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await chatWithGemini(history || [], message, context);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Failed to chat with AI' });
  }
});

export default router;
