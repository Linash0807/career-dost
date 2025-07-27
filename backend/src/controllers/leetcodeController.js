import { LeetCode } from 'leetcode-query';

const leetCode = new LeetCode();

// Fetch LeetCode user profile data
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Try different methods available in leetcode-query
    let userData;
    try {
      // Method 1: Try user method
      userData = await leetCode.user(username);
    } catch (error) {
      try {
        // Method 2: Try profile method
        userData = await leetCode.profile(username);
      } catch (error2) {
        // Method 3: Try to get user info
        userData = await leetCode.getUserInfo(username);
      }
    }

    res.json({
      success: true,
      data: userData,
      username: username
    });
  } catch (error) {
    console.error('LeetCode getUserProfile error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch LeetCode user profile', 
      error: error.message,
      username: req.params.username 
    });
  }
};

// Get LeetCode user submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const submissions = await leetCode.submissions(username);
    res.json({
      success: true,
      data: submissions,
      username: username
    });
  } catch (error) {
    console.error('LeetCode getUserSubmissions error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch LeetCode user submissions', 
      error: error.message 
    });
  }
};

// Get LeetCode user problems solved
export const getUserProblems = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const problems = await leetCode.problems(username);
    res.json({
      success: true,
      data: problems,
      username: username
    });
  } catch (error) {
    console.error('LeetCode getUserProblems error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch LeetCode user problems', 
      error: error.message 
    });
  }
};
