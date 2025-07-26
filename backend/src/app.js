import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.js';
import authRoutes from './routes/auth.js';
import careerPathRoutes from './routes/careerPath.js';
import contestRoutes from './routes/contest.js';
import resourceRoutes from './routes/resource.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/resources', resourceRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('BTech Companion Backend is running!');
});

// Auth routes
app.use('/api/auth', authRoutes);

// Task routes
app.use('/api/tasks', taskRoutes);

// Career Path routes
app.use('/api/career-path', careerPathRoutes);

// Resource routes
app.use('/api/resources', resourceRoutes);

// Contest routes
app.use('/api/contests', contestRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-dost', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
