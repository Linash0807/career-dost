import Contest from '../models/Contest.js';

// Create a new contest
export const createContest = async (req, res) => {
  try {
    const { name, platform, startTime, endTime, url, reminderSet } = req.body;
    const user = req.user.userId;
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
    const user = req.user.userId;
    const contests = await Contest.find({ user });
    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a contest
export const updateContest = async (req, res) => {
  try {
    const user = req.user.userId;
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
    const user = req.user.userId;
    const { id } = req.params;
    const contest = await Contest.findOneAndDelete({ _id: id, user });
    if (!contest) return res.status(404).json({ message: 'Contest not found' });
    res.json({ message: 'Contest deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
