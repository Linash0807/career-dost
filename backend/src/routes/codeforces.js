import express from 'express';
import { getUserInfo } from '../controllers/codeforcesController.js';

const router = express.Router();

router.get('/user/:handle', getUserInfo);

export default router;
