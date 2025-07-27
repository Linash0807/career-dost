// Script to import roadmapSeed.json into CareerPath collection as templates

const mongoose = require('mongoose');
const CareerPath = require('./src/models/CareerPath.js').default;
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/career-dost';

const importRoadmaps = async () => {
  await mongoose.connect(MONGO_URI);
  const data = JSON.parse(fs.readFileSync('roadmapSeed.json', 'utf-8'));
  // Remove all existing templates (user: undefined)
  await CareerPath.deleteMany({ user: { $exists: false } });
  // Insert new templates
  for (const roadmap of data) {
    await CareerPath.create({ ...roadmap });
  }
  console.log(`✅ Imported ${data.length} roadmaps as templates.`);
  await mongoose.disconnect();
};

importRoadmaps();
