export const getDashboardStats = async (req, res) => {
    try {
        res.json({
            completedTasks: 0,
            pendingTasks: 0,
            bookmarkedResources: 0,
            contestsParticipated: 0,
            totalTasks: 0,
            activeGoals: 0,
            currentStreak: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getActivityHeatmap = async (req, res) => {
    try {
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSkillDistribution = async (req, res) => {
    try {
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
