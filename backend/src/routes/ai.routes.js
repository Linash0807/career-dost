import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/ai/chat - Protected route
router.post('/chat', auth, chatWithAI);

export default router;
