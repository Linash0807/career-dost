import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: Date,
  skills: [{ type: String }],  // Array of skills for this milestone
  resources: [{ type: String }],  // Array of learning resources
  estimatedTime: { type: String }  // Estimated time to complete
});

const careerPathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },  // Career path description
  icon: { type: String, required: true },  // Emoji icon for the career path
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  estimatedDuration: { type: String, required: true },  // Estimated time to complete the path
  milestones: [milestoneSchema],
  progress: { type: Number, default: 0 },  // Overall progress percentage
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
careerPathSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('CareerPath', careerPathSchema);
