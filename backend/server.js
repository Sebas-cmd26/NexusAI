import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './routes/news.js';
import aiRoutes from './routes/ai.js';
import groupsRoutes from './routes/groups.js';
import { startNewsSync } from './services/newsSync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', newsRoutes);
app.use('/api', aiRoutes);
app.use('/api/groups', groupsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Start Server & Sync
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startNewsSync(); // Start background news synchronization
});
