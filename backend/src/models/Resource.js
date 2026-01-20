import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  type: {
    type: String,
    enum: ['video', 'article', 'course', 'documentation'],
    required: true
  },
  url: { type: String, required: true },
  category: { type: String, required: true, trim: true }, // Replaces domain
  tags: [{ type: String, trim: true }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPremium: { type: Boolean, default: false },

  // Social features (kept from original)
  ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }],
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String }],
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approved: { type: Boolean, default: true }, // Default to true for seeded content
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resource', resourceSchema);
