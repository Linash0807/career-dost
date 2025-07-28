import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.js';
import authRoutes from './routes/auth.js';
import careerPathRoutes from './routes/careerPath.js';
import contestRoutes from './routes/contest.js';
import resourceRoutes from './routes/resource.js';
import leetcodeRoutes from './routes/leetcode.js';
import codeforcesRoutes from './routes/codeforces.js';
import seedCareerPaths from './seed/careerPathsSeed.js';
dotenv.config();

const app = express();
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
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

  
// LeetCode routes
app.use('/api/leetcode', leetcodeRoutes);

// Codeforces routes
app.use('/api/codeforces', codeforcesRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/career-dost', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  // Seed career paths on startup
  try {
    await seedCareerPaths();
  } catch (error) {
    console.error('Error seeding career paths:', error);
  }
  
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
