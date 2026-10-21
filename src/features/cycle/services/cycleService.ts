import api from '@/shared/services/api/api';
import type { Cycle, CycleConfig, CycleBlock, CycleSummary } from '../types/cycle.types';
import type { Topic } from '../../topics/types/topic.types';

class CycleService {
    private currentCycle: Cycle | null = null;

    async getCurrentCycle(): Promise<Cycle | null> {
        try {
            const response = await api.get('/cycles/active');
            this.currentCycle = response.data;
            return this.currentCycle;
        } catch (error) {
            console.error('Erro ao buscar ciclo ativo:', error);
            return null;
        }
    }

    async getSummary(): Promise<CycleSummary> {
        try {
            const response = await api.get('/cycles/summary');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
            return { totalCycles: 0, totalStudyMinutes: 0, currentCycle: null };
        }
    }

    async generateCycle(config: CycleConfig, topics: Topic[]): Promise<Cycle> {
        let availableTopics = topics;
        if (config.selectedTopics.length > 0) {
            availableTopics = topics.filter(t => config.selectedTopics.includes(t.id));
        }

        const blocks = this.generateBlocks(availableTopics, config);
        const totalMinutes = blocks.reduce((sum, block) => sum + block.minutes, 0);
        const cycleNumber = await this.getNextCycleNumber();

        const cycleData = {
            number: cycleNumber,
            config,
            blocks,
            totalMinutes,
            completedMinutes: 0,
            remainingMinutes: totalMinutes,
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: new Date(),
            isActive: true
        };

        const response = await api.post('/cycles', cycleData);
        this.currentCycle = response.data;
        return this.currentCycle as Cycle;
    }

    // concluir um bloco e concluir um conteúdo são eventos independentes
    // (spec 1.1). A conclusão de conteúdo é feita à parte, via
    // topicsService, quando o usuário pede explicitamente.
    async completeBlock(cycleId: string, blockId: string): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('completeBlock: cycleId inválido:', cycleId);
            return null;
        }

        try {
            const response = await api.put(`/cycles/${cycleId}/blocks/${blockId}/complete`);
            const updatedCycle = response.data;
            if (!updatedCycle) return null;

            this.currentCycle = updatedCycle;
            return updatedCycle;
        } catch (error) {
            console.error('Erro ao completar bloco:', error);
            return null;
        }
    }

    async decrementBlockMinutes(cycleId: string, blockId: string, minutesToDecrement: number): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('x decrementBlockMinutes: cycleId inválido:', cycleId);
            return null;
        }

        const decrement = Math.max(0, Math.floor(minutesToDecrement));
        if (decrement === 0) return this.currentCycle;

        try {
            console.log(`Decrementando ${decrement} min do bloco ${blockId} no ciclo ${cycleId}`);

            const response = await api.put(`/cycles/${cycleId}/blocks/${blockId}/decrement`, {
                minutesToDecrement: decrement
            });
            this.currentCycle = response.data;
            return this.currentCycle;
        } catch (error) {
            console.error('Erro ao decrementar minutos:', error);
            return null;
        }
    }

    async updateBlocks(cycleId: string, blocks: CycleBlock[]): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('x updateBlocks: cycleId inválido:', cycleId);
            return null;
        }

        try {
            const normalizedBlocks = blocks.map((block, index) => ({
                ...block,
                position: index
            }));

            const response = await api.put(`/cycles/${cycleId}`, { blocks: normalizedBlocks });
            this.currentCycle = response.data;
            return this.currentCycle;
        } catch (error) {
            console.error('Erro ao atualizar blocos do ciclo:', error);
            throw error;
        }
    }

    async syncWithTopics(cycleId: string, topics: Topic[]): Promise<Cycle | null> {
        if (!cycleId || cycleId === 'undefined') {
            console.error('x syncWithTopics: cycleId inválido:', cycleId);
            return null;
        }

        try {
            const response = await api.get(`/cycles/${cycleId}`);
            const cycle = response.data;
            if (!cycle) return null;

            let hasChanges = false;
            for (const block of cycle.blocks) {
                const topic = topics.find(t => t.id === block.topicId);
                if (topic) {
                    const newCurrentContent = this.getCurrentContent(topic);
                    if (newCurrentContent && block.currentContent !== newCurrentContent.title) {
                        block.currentContent = newCurrentContent.title;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges) {
                const updateResponse = await api.put(`/cycles/${cycleId}`, { blocks: cycle.blocks });
                this.currentCycle = updateResponse.data;
                return this.currentCycle;
            }

            this.currentCycle = cycle;
            return cycle;
        } catch (error) {
            console.error('Erro ao sincronizar com tópicos:', error);
            return null;
        }
    }

    resetCycle(): void {
        this.currentCycle = null;
    }

    private roundToMultipleOf5(minutes: number): number {
        return Math.round(minutes / 5) * 5;
    }

    private readonly difficultyWeight = {
        facil: 0,
        medio: 0.5,
        dificil: 1
    };

    private readonly difficultyRepeats = {
        facil: 1,
        medio: 2,
        dificil: 3
    };

    private generateBlocks(topics: Topic[], config: CycleConfig): CycleBlock[] {
        const blocks: CycleBlock[] = [];
        if (topics.length === 0) return blocks;

        const minTime = config.minMinutesPerTopic;
        const maxTime = config.minutesPerTopic;
        const range = maxTime - minTime;

        const topicPlans = topics.map(topic => {
            const weight = this.difficultyWeight[topic.difficulty] ?? 0.5;
            const repeats = this.difficultyRepeats[topic.difficulty] ?? 2;

            let blockMinutes = minTime + range * weight;
            blockMinutes = this.roundToMultipleOf5(blockMinutes);
            blockMinutes = Math.min(Math.max(blockMinutes, minTime), maxTime);

            return { topic, blockMinutes, repeats };
        });

        const ordered = this.interleaveWeighted(topicPlans);

        ordered.forEach((plan, index) => {
            const currentContent = this.getCurrentContent(plan.topic);
            const contentTitle = currentContent?.title || "Estudo do tópico";

            blocks.push({
                id: crypto.randomUUID(),
                topicId: plan.topic.id,
                topicName: plan.topic.name,
                position: index,
                minutes: plan.blockMinutes,
                originalMinutes: plan.blockMinutes,
                completed: false,
                currentContent: contentTitle
            });
        });

        return blocks;
    }

    private interleaveWeighted<T extends { repeats: number }>(plans: T[]): T[] {
        if (plans.length === 0) return [];

        const totalOccurrences = plans.reduce((sum, p) => sum + p.repeats, 0);
        const currentWeight = new Map<T, number>(plans.map(p => [p, 0]));
        const result: T[] = [];

        for (let i = 0; i < totalOccurrences; i++) {
            plans.forEach(p => {
                currentWeight.set(p, (currentWeight.get(p) || 0) + p.repeats);
            });

            let chosen = plans[0];
            let maxWeight = -Infinity;
            plans.forEach(p => {
                const w = currentWeight.get(p)!;
                if (w > maxWeight) {
                    maxWeight = w;
                    chosen = p;
                }
            });

            result.push(chosen);
            currentWeight.set(chosen, maxWeight - totalOccurrences);
        }

        return result;
    }

    private getCurrentContent(topic: Topic): { title: string } | null {
        const pendingContents = topic.contents
            .filter(c => !c.completed)
            .sort((a, b) => a.order - b.order);
        if (pendingContents.length > 0) {
            return { title: pendingContents[0].title };
        }
        if (topic.contents.length > 0) {
            const lastContent = topic.contents.sort((a, b) => a.order - b.order)[topic.contents.length - 1];
            return { title: lastContent.title };
        }
        return null;
    }

    private async getNextCycleNumber(): Promise<number> {
        try {
            const response = await api.get('/cycles');
            const cycles = response.data;
            return cycles.length + 1;
        } catch {
            return 1;
        }
    }
}

export const cycleService = new CycleService();