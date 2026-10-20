import type { Topic } from '../../topics/types/topic.types';

export type ConditionType = '=' | '>' | '<' | '>=' | '<=' | '!=';
export type LogicalOperator = 'deve estar' | 'não deve estar';
export type TimeRelation = 'antes' | 'depois' | 'entre';

export interface CycleRule {
    id: string;
    topic1: string;
    logicalOperator: LogicalOperator;
    timeRelation: TimeRelation;
    topic2: string;
}

export interface CycleConfig {
    minutesPerTopic: number;
    minMinutesPerTopic: number;
    selectedTopics: string[];
    rules: CycleRule[];
}

export interface CycleBlock {
    id: string;
    topicId: string;
    topicName: string;
    position: number;
    minutes: number;
    originalMinutes?: number;
    completed: boolean;
    completedAt?: Date;
    currentContent?: string;
}

export interface Cycle {
    id: string;
    number: number;
    config: CycleConfig;
    blocks: CycleBlock[];
    totalMinutes: number;
    completedMinutes: number;
    remainingMinutes: number;
    createdAt: Date;
    updatedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    isActive: boolean;
}

export interface CycleSummary {
    totalCycles: number;
    totalStudyMinutes: number;
    currentCycle: Cycle | null;
}

export type { Topic };