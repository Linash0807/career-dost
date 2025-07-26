import express from 'express';
import auth from '../middleware/auth.js';
import { createResource, getResources, updateResource, deleteResource } from '../controllers/resourceController.js';

const router = express.Router();

// All routes protected
router.post('/', auth, createResource); // Create resource
router.get('/', auth, getResources); // Get all resources
router.put('/:id', auth, updateResource); // Update resource
router.delete('/:id', auth, deleteResource); // Delete resource

export default router;
