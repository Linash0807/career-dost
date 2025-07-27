import CareerPath from '../models/CareerPath.js';

// Create a new career path
export const createCareerPath = async (req, res) => {
  try {
    const { name, description, icon, difficulty, estimatedDuration, milestones } = req.body;
    const user = req.user._id;
    
    // Validate required fields
    if (!name || !description || !icon || !difficulty || !estimatedDuration) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, icon, difficulty, estimatedDuration' 
      });
    }

    const careerPath = new CareerPath({ 
      name, 
      description, 
      icon, 
      difficulty, 
      estimatedDuration, 
      milestones, 
      user 
    });
    await careerPath.save();
    res.status(201).json({ careerPath });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all career paths for the user
export const getCareerPaths = async (req, res) => {
  try {
    const user = req.user._id;
    const careerPaths = await CareerPath.find({ user }).sort({ createdAt: -1 });
    res.json({ careerPaths });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get a specific career path
export const getCareerPath = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const careerPath = await CareerPath.findOne({ _id: id, user });
    
    if (!careerPath) {
      return res.status(404).json({ message: 'Career path not found' });
    }
    
    res.json({ careerPath });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a career path
export const updateCareerPath = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const updates = req.body;
    
    // Calculate progress if milestones are updated
    if (updates.milestones) {
      const completedCount = updates.milestones.filter(m => m.completed).length;
      updates.progress = Math.round((completedCount / updates.milestones.length) * 100);
    }
    
    const careerPath = await CareerPath.findOneAndUpdate(
      { _id: id, user }, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!careerPath) {
      return res.status(404).json({ message: 'Career path not found' });
    }
    
    res.json({ careerPath });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a career path
export const deleteCareerPath = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const careerPath = await CareerPath.findOneAndDelete({ _id: id, user });
    
    if (!careerPath) {
      return res.status(404).json({ message: 'Career path not found' });
    }
    
    res.json({ message: 'Career path deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all available career path templates (for new users)
export const getCareerPathTemplates = async (req, res) => {
  try {
    // Get career paths that don't belong to any user (templates)
    const templates = await CareerPath.find({ user: { $exists: false } }).sort({ name: 1 });
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Clone a career path template for a user
export const cloneCareerPathTemplate = async (req, res) => {
  try {
    const user = req.user._id;
    const { templateId } = req.body;
    
    // Find the template
    const template = await CareerPath.findOne({ _id: templateId, user: { $exists: false } });
    if (!template) {
      return res.status(404).json({ message: 'Career path template not found' });
    }
    
    // Create a copy for the user
    const careerPath = new CareerPath({
      name: template.name,
      description: template.description,
      icon: template.icon,
      difficulty: template.difficulty,
      estimatedDuration: template.estimatedDuration,
      milestones: template.milestones,
      progress: 0,
      user
    });
    
    await careerPath.save();
    res.status(201).json({ careerPath });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
