import Task from '../models/Task.js';

// Helper function to validate task input
const validateTaskInput = (data, isUpdate = false) => {
  const { title, category, priority, dueDate } = data;
  const categories = ['DSA', 'Projects', 'Placements', 'Learning', 'Academic'];
  const priorities = ['Low', 'Medium', 'High'];

  if (!isUpdate) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return 'Title is required and must be a non-empty string.';
    }
    if (category && !categories.includes(category)) {
      return `Category must be one of: ${categories.join(', ')}`;
    }
    if (priority && !priorities.includes(priority)) {
      return `Priority must be one of: ${priorities.join(', ')}`;
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return 'DueDate must be a valid date string.';
    }
  } else {
    // For updates, only validate fields if present
    if ('title' in data && (typeof title !== 'string' || title.trim() === '')) {
      return 'Title must be a non-empty string.';
    }
    if ('category' in data && !categories.includes(category)) {
      return `Category must be one of: ${categories.join(', ')}`;
    }
    if ('priority' in data && !priorities.includes(priority)) {
      return `Priority must be one of: ${priorities.join(', ')}`;
    }
    if ('dueDate' in data && isNaN(Date.parse(dueDate))) {
      return 'DueDate must be a valid date string.';
    }
  }
  return null;
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, category, priority, dueDate } = req.body;
    const userId = req.user._id;

    const validationError = validateTaskInput({ title, category, priority, dueDate });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = new Task({
      title,
      category,
      priority,
      dueDate,
      user: userId,
    });

    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error fetching tasks', error: error.message });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;
    const updates = req.body;

    const validationError = validateTaskInput(updates, true); // allow partial update
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};
