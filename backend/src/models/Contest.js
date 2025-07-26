import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  name: String,
  platform: String, // Codeforces, LeetCode, etc.
  startTime: Date,
  endTime: Date,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reminderSet: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contest', contestSchema);
