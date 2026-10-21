export type NotebookColor = 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
export type DifficultyLevel = 'facil' | 'medio' | 'dificil';
export type ImportanceLevel = 'pouco' | 'normal' | 'muita';

export interface Tag {
    id: string;
    label: string;
    color?: string;
}


export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    order: number;
}

export interface ReviewHistoryItem {
    id: string;
    date: Date;
    duration?: number;
    notes: string;
    rating?: 'easy' | 'medium' | 'hard';
}

export interface QuestionList {
    id: string;
    title: string;
    total: number;
    hits: number;
}

export interface ContentStudyData {
    totalTimeSpent: number;
    notes: string;
    startedAt: Date | null;
    completedAt: Date | null;
    lastReviewDate: Date | null;
    nextReviewDate: Date | null;
    reviewHistory: ReviewHistoryItem[];
    questionLists?: QuestionList[];
}

export interface Content {
    id: string;
    title: string;
    importance: ImportanceLevel;
    completed: boolean;
    order: number;
    createdAt: Date;
    checklist: ChecklistItem[];
    studyData: ContentStudyData;
    tags?: string[];
}

export interface Topic {
    id: string;
    name: string;
    editalId?: string;
    notebookColor: NotebookColor;
    difficulty: DifficultyLevel;
    tags: Tag[];
    contents: Content[];
    createdAt: Date;
    updatedAt: Date;
    progress?: number;
    lastAccessed?: Date;
    totalMinutes?: number;
}

export interface CreateContentDTO {
    title: string;
    importance: ImportanceLevel;
    tags?: string[];
}

export interface CreateTopicDTO {
    name: string;
    notebookColor: NotebookColor;
    difficulty: DifficultyLevel;
    editalId?: string;
    tags: Tag[];
    contents: CreateContentDTO[];
}

export interface UpdateTopicDTO extends Partial<CreateTopicDTO> {
    id: string;
}


export function createDefaultStudyData(): ContentStudyData {
    return {
        totalTimeSpent: 0,
        notes: '',
        startedAt: null,
        completedAt: null,
        lastReviewDate: null,
        nextReviewDate: null,
        reviewHistory: [],
        questionLists: []
    };
}

export function createDefaultChecklist(): ChecklistItem[] {
    return [];
}

export function migrateContent(oldContent: any): Content {
    return {
        id: oldContent.id,
        title: oldContent.title,
        importance: oldContent.importance,
        completed: oldContent.completed,
        order: oldContent.order,
        createdAt: oldContent.createdAt,
        checklist: oldContent.checklist || createDefaultChecklist(),
        studyData: oldContent.studyData || createDefaultStudyData()
    };
}

export function migrateTopic(oldTopic: any): Topic {
    return {
        ...oldTopic,
        contents: oldTopic.contents.map(migrateContent),
        totalMinutes: oldTopic.totalHours ? oldTopic.totalHours * 60 : oldTopic.totalMinutes
    };
}