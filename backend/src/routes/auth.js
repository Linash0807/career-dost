import express from 'express';
import { register, login, getStreakStats } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();
// GET /api/auth/streak (protected)
router.get('/streak', auth, getStreakStats);


// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (protected)
router.get('/profile', auth, async (req, res) => {
  try {
    // req.user._id is set by auth middleware
    const userId = req.user._id;
    const user = await (await import('../models/User.js')).default.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
