import express from 'express';
import { getNewsFromSupabase, searchNewsInSupabase } from '../services/supabaseService.js';

const router = express.Router();

// GET /api/feed?sector=
router.get('/feed', async (req, res) => {
  try {
    const { sector } = req.query;
    const news = await getNewsFromSupabase(sector);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
});

// GET /api/search?q=
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const results = await searchNewsInSupabase(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search news' });
  }
});

export default router;
