import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    console.error('Error in getStreakStats:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

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
    console.error('Registration error:', err);
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
    console.log('Login attempt for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // Check password
    if (!user.password) {
      console.log('User has no password set:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // --- Streak Logic ---
    try {
      const today = new Date();
      const todayDateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

      let loginDates = user.loginDates || [];

      // Ensure all dates are Date objects (MongoDB might return ISO strings)
      const formattedDates = loginDates.map(d => new Date(d));

      // Only add if not already logged in today
      const hasLoggedInToday = formattedDates.some(d => {
        try {
          return d.toISOString().slice(0, 10) === todayDateStr;
        } catch (e) {
          return false;
        }
      });

      if (!hasLoggedInToday) {
        formattedDates.push(today);
        // Sort dates ascending
        const sortedDates = formattedDates.sort((a, b) => a - b);

        // Calculate streaks
        let streak = 1;
        let maxStreak = user.maxStreak || 1;

        for (let i = sortedDates.length - 2; i >= 0; i--) {
          const prev = new Date(sortedDates[i]);
          const curr = new Date(sortedDates[i + 1]);

          // Set both to midnight for accurate day difference
          prev.setHours(0, 0, 0, 0);
          curr.setHours(0, 0, 0, 0);

          const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
          } else if (diff > 1) {
            break;
          }
        }

        if (streak > maxStreak) maxStreak = streak;

        user.loginDates = sortedDates;
        user.currentStreak = streak;
        user.maxStreak = maxStreak;
        await user.save();
      }
    } catch (streakError) {
      console.error('Non-blocking streak logic error:', streakError);
      // We don't want to fail the whole login if streak calculation fails
    }
    // --- End Streak Logic ---

    // Create JWT
    console.log('Generating token for user:', user._id);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        currentStreak: user.currentStreak,
        maxStreak: user.maxStreak,
      }
    });
  } catch (err) {
    console.error('Detailed Login Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
