import api from '@/shared/services/api/api';
import type { Topic, CreateTopicDTO, Content } from '../types/topic.types';

const adaptTopic = (backendTopic: any): Topic => {
    return {
        ...backendTopic,
        id: backendTopic._id || backendTopic.id,
        contents: backendTopic.contents?.map((content: any) => ({
            ...content,
            id: content._id || content.id,
            studyData: {
                ...content.studyData,
                totalTimeSpent: content.studyData?.totalTimeSpent || 0,
                notes: content.studyData?.notes || '',
                startedAt: content.studyData?.startedAt || null,
                completedAt: content.studyData?.completedAt || null,
                lastReviewDate: content.studyData?.lastReviewDate || null,
                nextReviewDate: content.studyData?.nextReviewDate || null,
                reviewHistory: content.studyData?.reviewHistory || [],
                questionLists: content.studyData?.questionLists || []
            }
        })) || []
    };
};

export const topicsService = {
    async getAll(): Promise<Topic[]> {
        const response = await api.get('/topics');
        return response.data.map(adaptTopic);
    },

    async getById(id: string): Promise<Topic | undefined> {
        const response = await api.get(`/topics/${id}`);
        return adaptTopic(response.data);
    },

    async create(data: CreateTopicDTO): Promise<Topic> {
        const response = await api.post('/topics', data);
        return adaptTopic(response.data);
    },

    async createMultiple(topicsData: CreateTopicDTO[]): Promise<Topic[]> {
        const topics = await Promise.all(
            topicsData.map(data => this.create(data))
        );
        return topics;
    },

    async update(id: string, data: Partial<Topic>): Promise<Topic> {
        const response = await api.put(`/topics/${id}`, data);
        return adaptTopic(response.data);
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/topics/${id}`);
    },

    async updateLastAccessed(id: string): Promise<{ lastAccessed: Date }> {
        const response = await api.post(`/topics/${id}/access`);
        return response.data;
    },

    async addStudyMinutes(id: string, minutes: number): Promise<Topic> {
        const response = await api.post(`/topics/${id}/study-minutes`, { minutes });
        return adaptTopic(response.data);
    },

    async updateContentNotes(topicId: string, contentId: string, notes: string): Promise<Topic> {
        const response = await api.put(`/topics/${topicId}/contents/${contentId}/notes`, { notes });
        return adaptTopic(response.data);
    },

    async updateContentChecklist(topicId: string, contentId: string, checklist: Content['checklist']): Promise<Topic> {
        const response = await api.put(`/topics/${topicId}/contents/${contentId}/checklist`, { checklist });
        return adaptTopic(response.data);
    },

    async updateContentQuestionLists(topicId: string, contentId: string, questionLists: any): Promise<Topic> {
        const response = await api.put(`/topics/${topicId}/contents/${contentId}/questions`, { questionLists });
        return adaptTopic(response.data);
    },

    async markContentAsCompleted(topicId: string, contentId: string): Promise<Topic> {
        const response = await api.put(`/topics/${topicId}/contents/${contentId}/complete`);
        return adaptTopic(response.data);
    },

    async getCurrentContent(topicId: string): Promise<Content | null> {
        const topic = await this.getById(topicId);
        if (!topic) return null;

        const pendingContent = topic.contents.find(c => !c.completed);
        if (pendingContent) return pendingContent;

        return topic.contents.length > 0 ? topic.contents[topic.contents.length - 1] : null;
    },

    async updateContentTime(topicId: string, contentId: string, additionalMinutes: number): Promise<Topic> {
        const topic = await this.getById(topicId);
        if (!topic) throw new Error('Tópico não encontrado');

        const content = topic.contents.find(c => c.id === contentId);
        if (!content) throw new Error('Conteúdo não encontrado');

        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    studyData: {
                        ...c.studyData,
                        totalTimeSpent: (c.studyData?.totalTimeSpent || 0) + additionalMinutes,
                        startedAt: c.studyData?.startedAt || new Date()
                    }
                }
                : c
        );

        return this.update(topicId, {
            contents: updatedContents,
            totalMinutes: (topic.totalMinutes || 0) + additionalMinutes,
            lastAccessed: new Date()
        });
    }
};