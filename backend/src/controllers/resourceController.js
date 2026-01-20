import Resource from '../models/Resource.js';

// Create a new resource
// Create a new resource
export const createResource = async (req, res) => {
  try {
    const { title, description, type, url, category, tags, difficulty, isPremium } = req.body;
    // const user = req.user._id; // Fixed naming convention

    const resource = new Resource({
      title,
      description,
      type,
      url,
      category,
      tags,
      difficulty,
      isPremium,
      // submittedBy: user,
      approved: true // Auto-approve for now
    });

    await resource.save();
    res.status(201).json({ resource });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all resources with filtering
export const getResources = async (req, res) => {
  try {
    const { category, type, difficulty, search } = req.query;
    const query = { approved: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
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
