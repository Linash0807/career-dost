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
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
