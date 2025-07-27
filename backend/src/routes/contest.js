import express from 'express';
import auth from '../middleware/auth.js';
import { 
  createContest, 
  getContests, 
  updateContest, 
  deleteContest, 
  toggleReminder, 
  seedContests,
  getLeetCodeContests,
  getCodeforcesContests,
  getCodeChefContests,
  saveRealTimeContests
} from '../controllers/contestController.js';

const router = express.Router();

// All routes protected
router.post('/', auth, createContest); // Create contest
router.get('/', auth, getContests); // Get all contests
router.put('/:id', auth, updateContest); // Update contest
router.delete('/:id', auth, deleteContest); // Delete contest
router.put('/:id/reminder', auth, toggleReminder); // Toggle reminder
router.post('/seed', auth, seedContests); // Manual seed contests

// Real-time contest fetching routes
router.get('/leetcode', auth, getLeetCodeContests); // Fetch LeetCode contests
router.get('/codeforces', auth, getCodeforcesContests); // Fetch Codeforces contests
router.get('/codechef', auth, getCodeChefContests); // Fetch CodeChef contests
router.post('/save-realtime', auth, saveRealTimeContests); // Save real-time contests

export default router;
