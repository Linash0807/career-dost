import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: String, // task, contest, streak, forum, etc.
  message: String,
  read: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
