import express from 'express';
import auth from '../middleware/auth.js';
import { getDashboardStats, getActivityHeatmap, getSkillDistribution } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/stats', auth, getDashboardStats);
router.get('/activity', auth, getActivityHeatmap);
router.get('/skills', auth, getSkillDistribution);

export default router;
