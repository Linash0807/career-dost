import api from './api';

export interface Resource {
    _id: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'course' | 'documentation';
    url: string;
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    isPremium: boolean;
    createdAt: string;
}

export interface ResourceFilters {
    category?: string;
    type?: string;
    difficulty?: string;
    search?: string;
}

export const getResources = async (filters: ResourceFilters = {}): Promise<Resource[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.difficulty && filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/resources?${params.toString()}`);
    return response.data.resources;
};

export const getResourceById = async (id: string): Promise<Resource> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
};
