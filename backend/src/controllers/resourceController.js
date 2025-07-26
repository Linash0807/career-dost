import Resource from '../models/Resource.js';

// Create a new resource
export const createResource = async (req, res) => {
  try {
    const { title, url, domain, difficulty, description } = req.body;
    const user = req.user.userId;
    const resource = new Resource({ title, url, domain, difficulty, description, submittedBy: user });
    await resource.save();
    res.status(201).json({ resource });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ approved: true });
    res.json({ resources });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a resource (for moderators)
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const resource = await Resource.findByIdAndUpdate(id, updates, { new: true });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ resource });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a resource (for moderators)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
