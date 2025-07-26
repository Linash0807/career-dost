import express from 'express';
import auth from '../middleware/auth.js';
import { createContest, getContests, updateContest, deleteContest } from '../controllers/contestController.js';

const router = express.Router();

// All routes protected
router.post('/', auth, createContest); // Create contest
router.get('/', auth, getContests); // Get all contests
router.put('/:id', auth, updateContest); // Update contest
router.delete('/:id', auth, deleteContest); // Delete contest

export default router;
