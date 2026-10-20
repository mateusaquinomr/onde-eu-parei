import { useState, useCallback, useEffect } from 'react';
import type { Cycle, CycleConfig, CycleRule, CycleSummary, CycleBlock } from '../types/cycle.types';
import { cycleService } from '../services/cycleService';
import { useTopics } from '../../topics/hooks/useTopics';

export function useCycle() {
    const { topics } = useTopics();
    const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
    const [cycleSummary, setCycleSummary] = useState<CycleSummary>({
        totalCycles: 0,
        totalStudyMinutes: 0,
        currentCycle: null
    });
    const [config, setConfig] = useState<CycleConfig>(() => {
        const savedConfig = localStorage.getItem('cycleConfig');
        if (savedConfig) {
            return JSON.parse(savedConfig);
        }
        return {
            minutesPerTopic: 60,
            minMinutesPerTopic: 30,
            selectedTopics: [],
            rules: []
        };
    });
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                const [activeCycle, summary] = await Promise.all([
                    cycleService.getCurrentCycle(),
                    cycleService.getSummary()
                ]);
                setCurrentCycle(activeCycle);
                setCycleSummary(summary);
                setIsConfigModalOpen(!activeCycle);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setIsConfigModalOpen(true);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const syncWithTopics = async () => {
            if (currentCycle && topics.length > 0) {
                const updatedCycle = await cycleService.syncWithTopics(currentCycle.id, topics);
                if (updatedCycle) {
                    setCurrentCycle(updatedCycle);
                    const summary = await cycleService.getSummary();
                    setCycleSummary(summary);
                }
            }
        };
        syncWithTopics();
    }, [topics, currentCycle?.id]);

    const updateConfig = useCallback((updates: Partial<CycleConfig>) => {
        setConfig(prev => {
            const newConfig = { ...prev, ...updates };
            localStorage.setItem('cycleConfig', JSON.stringify(newConfig));
            return newConfig;
        });
    }, []);

    const addRule = useCallback((rule: Omit<CycleRule, 'id'>) => {
        const newRule: CycleRule = {
            ...rule,
            id: crypto.randomUUID()
        };
        setConfig(prev => ({
            ...prev,
            rules: [...prev.rules, newRule]
        }));
    }, []);

    const removeRule = useCallback((ruleId: string) => {
        setConfig(prev => ({
            ...prev,
            rules: prev.rules.filter(r => r.id !== ruleId)
        }));
    }, []);

    const selectTopics = useCallback((topicIds: string[]) => {
        setConfig(prev => ({
            ...prev,
            selectedTopics: topicIds
        }));
    }, []);

    const generateCycle = useCallback(async () => {
        const cycle = await cycleService.generateCycle(config, topics);
        setCurrentCycle(cycle);
        const summary = await cycleService.getSummary();
        setCycleSummary(summary);
        setIsConfigModalOpen(false);
        setCurrentStep(1);
        return cycle;
    }, [config, topics]);

    const completeBlock = useCallback(async (blockId: string) => {
        if (!currentCycle) return null;

        const updatedCycle = await cycleService.completeBlock(currentCycle.id, blockId);
        if (updatedCycle) {
            setCurrentCycle(updatedCycle);
            const summary = await cycleService.getSummary();
            setCycleSummary(summary);
        }
        return updatedCycle;
    }, [currentCycle]);

    const isCycleComplete = currentCycle
        ? currentCycle.blocks.length > 0 && currentCycle.blocks.every(b => b.completed)
        : false;

    const decrementBlockMinutes = useCallback(async (blockId: string, minutes: number) => {
        if (!currentCycle) return null;

        const updatedCycle = await cycleService.decrementBlockMinutes(currentCycle.id, blockId, minutes);
        if (updatedCycle) {
            setCurrentCycle(updatedCycle);
            const summary = await cycleService.getSummary();
            setCycleSummary(summary);
        }
        return updatedCycle;
    }, [currentCycle]);

    const updateBlocks = useCallback(async (blocks: CycleBlock[]) => {
        if (!currentCycle) return null;

        const updatedCycle = await cycleService.updateBlocks(currentCycle.id, blocks);
        if (updatedCycle) {
            setCurrentCycle(updatedCycle);
            const summary = await cycleService.getSummary();
            setCycleSummary(summary);
        }
        return updatedCycle;
    }, [currentCycle]);

    const nextStep = useCallback(() => {
        setCurrentStep(prev => prev + 1);
    }, []);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => prev - 1);
    }, []);

    const openConfigModal = useCallback(() => {
        setIsConfigModalOpen(true);
        setCurrentStep(1);
    }, []);

    const closeConfigModal = useCallback(() => {
        setIsConfigModalOpen(false);
        setCurrentStep(1);
    }, []);

    return {
        currentCycle,
        cycleSummary,
        config,
        isConfigModalOpen,
        currentStep,
        loading,
        updateConfig,
        addRule,
        removeRule,
        selectTopics,
        generateCycle,
        completeBlock,
        decrementBlockMinutes,
        updateBlocks,
        isCycleComplete,
        nextStep,
        prevStep,
        openConfigModal,
        closeConfigModal
    };
}