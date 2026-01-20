import express from 'express';
import { createPost, getPosts, addReply, upvotePost } from '../controllers/forumController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create a new forum post
router.post('/', createPost);

// Get all forum posts
router.get('/', getPosts);

// Add a reply to a forum post
router.post('/:id/reply', addReply);

// Upvote a forum post
router.post('/:id/upvote', upvotePost);

export default router;
