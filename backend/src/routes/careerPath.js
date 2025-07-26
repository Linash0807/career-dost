import express from 'express';
import auth from '../middleware/auth.js';
import { createCareerPath, getCareerPaths, updateCareerPath, deleteCareerPath } from '../controllers/careerPathController.js';

const router = express.Router();

// All routes protected
router.post('/', auth, createCareerPath); // Create career path
router.get('/', auth, getCareerPaths); // Get all career paths
router.put('/:id', auth, updateCareerPath); // Update career path
router.delete('/:id', auth, deleteCareerPath); // Delete career path

export default router;
