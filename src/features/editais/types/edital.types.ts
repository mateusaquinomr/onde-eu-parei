export interface Edital {
    id: string;
    nome: string;
    banca: string;
    dataProva: Date | string;
    local: string;
    topicosCount?: number;
    progresso?: number;
    archived?: boolean;
    archivedAt?: Date | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEditalDTO {
    nome: string;
    banca: string;
    dataProva: Date | string;
    local: string;
}

export interface UpdateEditalDTO {
    nome?: string;
    banca?: string;
    dataProva?: Date | string;
    local?: string;
    archived?: boolean;
    archivedAt?: Date | string | null;
}