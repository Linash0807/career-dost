import express from 'express';
import auth from '../middleware/auth.js';
import { 
  createCareerPath, 
  getCareerPaths, 
  getCareerPath,
  updateCareerPath, 
  deleteCareerPath,
  getCareerPathTemplates,
  cloneCareerPathTemplate
} from '../controllers/careerPathController.js';

const router = express.Router();

// All routes protected
router.post('/', auth, createCareerPath); // Create career path
router.get('/', auth, getCareerPaths); // Get all career paths for user
router.get('/templates', auth, getCareerPathTemplates); // Get career path templates
router.post('/clone', auth, cloneCareerPathTemplate); // Clone a template
router.get('/:id', auth, getCareerPath); // Get specific career path
router.put('/:id', auth, updateCareerPath); // Update career path
router.delete('/:id', auth, deleteCareerPath); // Delete career path

export default router;
