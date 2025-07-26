import CareerPath from '../models/CareerPath.js';

// Create a new career path
export const createCareerPath = async (req, res) => {
  try {
    const { name, milestones } = req.body;
    const user = req.user._id;
    const careerPath = new CareerPath({ name, milestones, user });
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
    const careerPaths = await CareerPath.find({ user });
    res.json({ careerPaths });
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
    const careerPath = await CareerPath.findOneAndUpdate({ _id: id, user }, updates, { new: true });
    if (!careerPath) return res.status(404).json({ message: 'Career path not found' });
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
    if (!careerPath) return res.status(404).json({ message: 'Career path not found' });
    res.json({ message: 'Career path deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
