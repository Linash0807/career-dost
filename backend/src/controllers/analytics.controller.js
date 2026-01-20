export const getDashboardStats = async (req, res) => {
    try {
        res.json({
            success: true,
            stats: {
                totalTasks: 0,
                completedTasks: 0,
                activeGoals: 0,
                currentStreak: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getActivityHeatmap = async (req, res) => {
    try {
        res.json({
            success: true,
            activities: []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSkillDistribution = async (req, res) => {
    try {
        res.json({
            success: true,
            skills: []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
