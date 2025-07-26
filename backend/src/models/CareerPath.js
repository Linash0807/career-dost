import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  skills: [String]  // Added skills array to milestone
});

const careerPathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  milestones: [milestoneSchema],
  progress: { type: Number, default: 0 },  // Added progress field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CareerPath', careerPathSchema);
