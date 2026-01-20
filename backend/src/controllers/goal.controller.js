export const getGoals = async (req, res) => {
    try {
        res.json({
            success: true,
            goals: []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createGoal = async (req, res) => {
    try {
        res.status(201).json({
            success: true,
            goal: req.body
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateGoal = async (req, res) => {
    try {
        res.json({
            success: true,
            goal: { id: req.params.id, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteGoal = async (req, res) => {
    try {
        res.json({
            success: true,
            message: "Goal deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
