
import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Use string IDs for contests like 'leetcode-weekly-375'
  name: { type: String, required: true },
  platform: { type: String, required: true }, // Codeforces, LeetCode, etc.
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  url: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Intermediate' 
  },
  participants: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reminderSet: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contest', contestSchema);
