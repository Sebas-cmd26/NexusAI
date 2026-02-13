import express from 'express';
import { getGroups, createGroup, getGroupMessages, sendMessage, shareArticleToGroup } from '../services/supabaseService.js';

const router = express.Router();

// GET /api/groups
router.get('/', async (req, res) => {
  try {
    const groups = await getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// POST /api/groups/create
router.post('/create', async (req, res) => {
  try {
    const group = await createGroup(req.body);
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// GET /api/groups/:id/messages
router.get('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;
    const messages = await getGroupMessages(id, limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/groups/messages
router.post('/messages', async (req, res) => {
  try {
    const message = await sendMessage(req.body);
    res.json({ data: message[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST /api/groups/share
router.post('/share', async (req, res) => {
    try {
        const { group_id, news_id, user_id } = req.body;
        const result = await shareArticleToGroup(group_id, news_id, user_id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to share article' });
    }
});

export default router;
