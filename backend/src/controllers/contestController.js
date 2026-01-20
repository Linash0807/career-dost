import Contest from '../models/Contest.js';
import axios from 'axios';

// Create a new contest
export const createContest = async (req, res) => {
  try {
    const { name, platform, startTime, endTime, url, reminderSet } = req.body;
    const user = req.user._id;
    const contest = new Contest({ name, platform, startTime, endTime, url, reminderSet, user });
    await contest.save();
    res.status(201).json({ contest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all contests for the user
export const getContests = async (req, res) => {
  try {
    const user = req.user._id;
    console.log('Getting contests for user:', user);
    const contests = await Contest.find({ user });
    console.log('Found contests:', contests.length);
    res.json({ contests });
  } catch (err) {
    console.error('Error getting contests:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a contest
export const updateContest = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const updates = req.body;
    const contest = await Contest.findOneAndUpdate({ _id: id, user }, updates, { new: true });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json({ contest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a contest
export const deleteContest = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const contest = await Contest.findOneAndDelete({ _id: id, user });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json({ message: 'Contest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Toggle reminder for a contest
export const toggleReminder = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const contest = await Contest.findOne({ _id: id, user });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });

    contest.reminderSet = !contest.reminderSet;
    await contest.save();

    res.json({ contest });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch real-time LeetCode contests
export const getLeetCodeContests = async (req, res) => {
  try {
    console.log('Fetching LeetCode contests...');

    // LeetCode doesn't have a public API for contests. You must use web scraping or unofficial APIs.
    // For now, return an empty list to avoid fake data.
    res.json({ success: true, contests: [] });
  } catch (err) {
    console.error('Error fetching LeetCode contests:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch LeetCode contests' });
  }
};

// Fetch real-time Codeforces contests
export const getCodeforcesContests = async (req, res) => {
  try {
    console.log('Fetching Codeforces contests...');

    // Codeforces has a public API
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result || [];

    // Filter upcoming contests and format them
    const upcomingContests = contests
      .filter(contest => contest.phase === 'BEFORE')
      .slice(0, 10) // Get next 10 contests
      .map(contest => ({
        id: contest.id.toString(),
        name: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
        url: `https://codeforces.com/contest/${contest.id}`,
        difficulty: contest.type === 'CF' ? 'Intermediate' : 'Beginner',
        participants: 0 // Codeforces API doesn't provide participant count
      }));

    res.json({ success: true, contests: upcomingContests });
  } catch (err) {
    console.error('Error fetching Codeforces contests:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch Codeforces contests' });
  }
};

// Fetch real-time CodeChef contests
export const getCodeChefContests = async (req, res) => {
  try {
    console.log('Fetching CodeChef contests...');

    // CodeChef doesn't have a public API for contests. You must use web scraping or unofficial APIs.
    // For now, return an empty list to avoid fake data.
    res.json({ success: true, contests: [] });
  } catch (err) {
    console.error('Error fetching CodeChef contests:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch CodeChef contests' });
  }
};

// Save real-time contests to user's database
export const saveRealTimeContests = async (req, res) => {
  try {
    const user = req.user._id;
    const { contests } = req.body;
    if (!contests || !Array.isArray(contests)) {
      return res.status(400).json({ success: false, message: 'Invalid contests data' });
    }

    // Clear existing contests for this user
    await Contest.deleteMany({ user: user });

    // Save new contests - only include fields defined in the schema
    const contestsWithUser = contests.map(contest => ({
      name: contest.name,
      platform: contest.platform,
      startTime: new Date(contest.startTime),
      endTime: new Date(contest.endTime),
      url: contest.url,
      difficulty: contest.difficulty || 'Intermediate',
      participants: contest.participants || 0,
      reminderSet: contest.reminderSet || false,
      user: user
    }));

    console.log(`Saving ${contestsWithUser.length} contests for user ${user}`);
    const savedContests = await Contest.insertMany(contestsWithUser);

    res.json({
      success: true,
      message: `Saved ${savedContests.length} contests`,
      contests: savedContests
    });
  } catch (err) {
    console.error('Error saving real-time contests:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save contests',
      error: err.message,
      details: err.errors // Mongoose validation errors
    });
  }
};

// Manual seed contests for testing
export const seedContests = async (req, res) => {
  try {
    const user = req.user._id;
    console.log('Manual seeding contests for user:', user);

    const contestsData = [
      {
        name: "LeetCode Weekly Contest 375",
        platform: "LeetCode",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        url: "https://leetcode.com/contest/weekly-contest-375",
        difficulty: "Intermediate",
        participants: 15000,
        reminderSet: false,
        user: user
      },
      {
        name: "Codeforces Round 920 (Div. 3)",
        platform: "Codeforces",
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 135 * 60 * 1000),
        url: "https://codeforces.com/contest/1921",
        difficulty: "Beginner",
        participants: 8000,
        reminderSet: true,
        user: user
      },
      {
        name: "CodeChef Starters 120",
        platform: "CodeChef",
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000),
        url: "https://www.codechef.com/START120",
        difficulty: "Beginner",
        participants: 12000,
        reminderSet: false,
        user: user
      },
      {
        name: "AtCoder Beginner Contest 340",
        platform: "AtCoder",
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 100 * 60 * 1000),
        url: "https://atcoder.jp/contests/abc340",
        difficulty: "Beginner",
        participants: 5000,
        reminderSet: true,
        user: user
      },
      {
        name: "HackerRank Weekly Challenge",
        platform: "HackerRank",
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        url: "https://www.hackerrank.com/contests/weekly-challenge",
        difficulty: "Intermediate",
        participants: 3000,
        reminderSet: false,
        user: user
      }
    ];

    // Clear existing contests for this user
    await Contest.deleteMany({ user: user });

    // Insert new contests
    const result = await Contest.insertMany(contestsData);
    console.log(`✅ Manual seeding successful! Created ${result.length} contests for user ${user}`);

    res.json({
      message: `Successfully seeded ${result.length} contests`,
      contests: result
    });
  } catch (err) {
    console.error('❌ Error in manual seeding:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
