// Script to fetch and format roadmap.sh data for career path seeding
// Usage: node roadmapScraper.js

import axios from 'axios';
import fs from 'fs';

const roadmapList = [
  'frontend',
  'backend',
  'devops',
  'react',
  'nodejs',
  'android',
  'qa',
  'blockchain',
  'python',
  'go',
  'vue',
  'angular',
  'java',
  'typescript',
  'docker',
  'postgresql',
  'mongodb',
  'cyber-security',
  'ai',
  'data-science',
  'flutter',
  'ios',
  'game-dev',
  'product-manager'
];

const fetchRoadmap = async (slug) => {
  const url = `https://api.roadmap.sh/v1/roadmaps/${slug}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch ${slug}:`, err.message);
    return null;
  }
};

const formatMilestones = (nodes) => {
  return nodes.map((node) => ({
    title: node.label,
    description: node.description || '',
    completed: false,
    dueDate: null,
    skills: node.tags || [],
    resources: node.resources ? node.resources.map(r => r.url) : [],
    estimatedTime: ''
  }));
};

const main = async () => {
  const allPaths = [];
  for (const slug of roadmapList) {
    const roadmap = await fetchRoadmap(slug);
    if (!roadmap) continue;
    allPaths.push({
      name: roadmap.title,
      description: roadmap.description || '',
      icon: '🛣️',
      difficulty: 'Intermediate',
      estimatedDuration: '',
      progress: 0,
      milestones: formatMilestones(roadmap.nodes || [])
    });
    console.log(`Fetched: ${roadmap.title}`);
  }
  fs.writeFileSync('roadmapSeed.json', JSON.stringify(allPaths, null, 2));
  console.log('✅ Saved to roadmapSeed.json');
};

main();
