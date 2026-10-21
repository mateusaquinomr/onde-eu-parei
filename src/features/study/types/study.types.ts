export interface StudyProgress {
    key: string;
    elapsedSeconds: number;
    lastUpdated: string;
}

export interface UseStudyTimerProps {
    sessionKey: string;
    estimatedTime?: number;
    onTimeUpdate?: (elapsedSeconds: number) => void;
    onMinuteTick?: (minutes: number) => void;
}

export interface TimerProps {
    sessionKey: string;
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime?: number;
    onTimeUpdate?: (elapsedSeconds: number) => void;
    onMinuteTick?: (minutes: number) => void;

    onFinishContent?: (contentId: string, elapsedSecondsAtThatMoment: number) => void;

    onCompleteBlock?: (sessionKey: string, totalSeconds: number) => void;
    className?: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    order: number;
}

export interface ChecklistProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
}

export interface QuestionList {
    id: string;
    title: string;
    total: number;
    hits: number;
}

export interface QuestionsProps {
    topicId: string;
    contentId: string;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
}

export interface Note {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface NotesProps {
    topicId: string;
    contentId: string;
    showHeader?: boolean;
    notes?: Note[];
    onUpdateNotes?: (notes: Note[]) => void;
}

export interface StudyToolsProps {
    topicId: string;
    contentId: string;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
    notes?: Note[];
    onUpdateNotes?: (notes: Note[]) => void;
}

export interface StudyWidgetProps {
    sessionKey: string;
    topicId: string;
    contentId: string;
    topicName: string;
    contentTitle: string;
    estimatedTime?: number;
    onTimeUpdate?: (elapsedSeconds: number) => void;
    onMinuteTick?: (minutes: number) => void;
    onFinishContent?: (contentId: string, elapsedSecondsAtThatMoment: number) => void;
    onCompleteBlock?: (sessionKey: string, totalSeconds: number) => void;
    checklist?: ChecklistItem[];
    onUpdateChecklist?: (items: ChecklistItem[]) => void;
    questionLists?: QuestionList[];
    onUpdateQuestions?: (lists: QuestionList[]) => void;
    notes?: Note[];
    onUpdateNotes?: (notes: Note[]) => void;
    className?: string;
}