import type { StudyProgress } from '../types/study.types';

class StudyTimerService {
    private readonly STORAGE_KEY = 'study_progress';

    saveProgress(key: string, elapsedSeconds: number): void {
        try {
            const progress = this.getAllProgress();
            progress[key] = {
                key,
                elapsedSeconds,
                lastUpdated: new Date().toISOString()
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Erro ao salvar progresso:', error);
        }
    }

    getProgress(key: string): StudyProgress | null {
        try {
            const all = this.getAllProgress();
            return all[key] || null;
        } catch {
            return null;
        }
    }

    getAllProgress(): Record<string, StudyProgress> {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    }

    clearProgress(key: string): void {
        try {
            const all = this.getAllProgress();
            delete all[key];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        } catch (error) {
            console.error('Erro ao limpar progresso:', error);
        }
    }
}

export const studyTimerService = new StudyTimerService();