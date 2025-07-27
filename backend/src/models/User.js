import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed
  avatar: { type: String },
  googleId: { type: String },
  careerPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CareerPath' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  contests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }],
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  loginDates: [{ type: Date }], // Track login dates for streaks
  currentStreak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
