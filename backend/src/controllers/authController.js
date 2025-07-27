// Get streak stats for the authenticated user
export const getStreakStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      currentStreak: user.currentStreak || 0,
      maxStreak: user.maxStreak || 0,
      loginDates: user.loginDates || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    // Create JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }

};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Streak Logic ---
    const today = new Date();
    const todayDateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    let loginDates = user.loginDates || [];
    // Only add if not already logged in today
    if (!loginDates.some(d => d.toISOString().slice(0, 10) === todayDateStr)) {
      loginDates.push(today);
      // Sort dates ascending
      loginDates = loginDates.sort((a, b) => new Date(a) - new Date(b));
      // Calculate streaks
      let streak = 1;
      let maxStreak = user.maxStreak || 1;
      for (let i = loginDates.length - 2; i >= 0; i--) {
        const prev = new Date(loginDates[i]);
        const curr = new Date(loginDates[i + 1]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
        } else if (diff > 1) {
          break;
        }
      }
      if (streak > maxStreak) maxStreak = streak;
      user.loginDates = loginDates;
      user.currentStreak = streak;
      user.maxStreak = maxStreak;
      await user.save();
    }
    // --- End Streak Logic ---

    // Create JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
