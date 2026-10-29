import { useState, useEffect, useCallback } from 'react';
import type { Topic, CreateTopicDTO } from '../types/topic.types';
import { topicsService } from '../services/topicsService';

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadTopics = useCallback(async () => {
        try {
            setLoading(true);
            const data = await topicsService.getAll();
            setTopics(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTopics();
    }, [loadTopics]);

    const createTopic = async (topicData: CreateTopicDTO) => {
        try {
            const newTopic = await topicsService.create(topicData);
            setTopics(prev => [...prev, newTopic]);
            return newTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const createMultipleTopics = async (topicsData: CreateTopicDTO[]) => {
        try {
            setLoading(true);
            const newTopics: Topic[] = [];

            for (const topicData of topicsData) {
                const newTopic = await topicsService.create(topicData);
                newTopics.push(newTopic);
            }

            setTopics(prev => [...prev, ...newTopics]);
            return newTopics;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateTopic = async (id: string, topicData: Partial<Topic>) => {
        try {
            const updatedTopic = await topicsService.update(id, topicData);
            setTopics(prevTopics => prevTopics.map(t =>
                t.id === id ? updatedTopic : t
            ));
            return updatedTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const deleteTopic = async (id: string) => {
        try {
            await topicsService.delete(id);
            setTopics(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const updateLastAccessed = async (id: string) => {
        try {
            const { lastAccessed } = await topicsService.updateLastAccessed(id);
            setTopics(prevTopics => prevTopics.map(t =>
                t.id === id ? { ...t, lastAccessed } : t
            ));
            return lastAccessed;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const addStudyMinutes = async (id: string, minutes: number) => {
        try {
            const updatedTopic = await topicsService.addStudyMinutes(id, minutes);
            setTopics(prevTopics => prevTopics.map(t =>
                t.id === id ? updatedTopic : t
            ));
            return updatedTopic;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        topics,
        loading,
        error,
        createTopic,
        createMultipleTopics,
        updateTopic,
        deleteTopic,
        updateLastAccessed,
        addStudyMinutes,
        refresh: loadTopics
    };
}