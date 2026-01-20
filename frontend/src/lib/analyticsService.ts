import api from './api';

export interface DashboardStats {
    completedTasks: number;
    pendingTasks: number;
    bookmarkedResources: number;
    contestsParticipated: number;
}

export interface ActivityData {
    date: string;
    count: number;
}

export interface SkillData {
    subject: string;
    A: number;
    fullMark: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get('/analytics/stats');
    return response.data;
};

export const getActivityHeatmap = async (): Promise<ActivityData[]> => {
    const response = await api.get('/analytics/activity');
    return response.data;
};

export const getSkillDistribution = async (): Promise<SkillData[]> => {
    const response = await api.get('/analytics/skills');
    return response.data;
};
