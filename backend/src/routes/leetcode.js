import express from 'express';
import { getUserProfile, getUserSubmissions, getUserProblems } from '../controllers/leetcodeController.js';

const router = express.Router();

router.get('/user/:username', getUserProfile);
router.get('/user/:username/submissions', getUserSubmissions);
router.get('/user/:username/problems', getUserProblems);

export default router;
