export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string;
    editalId?: string;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    dueDate?: string;
    editalId?: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    dueDate?: string | null;
    completed?: boolean;
    editalId?: string | null;
}