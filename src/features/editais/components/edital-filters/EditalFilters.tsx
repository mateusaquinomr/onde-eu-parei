import type { Edital } from '../../types/edital.types';
import styles from './EditalFilters.module.css';

interface Topic {
    editalId?: string;
}

interface EditalFiltersProps {
    editais: Edital[];
    topics: Topic[];
    loading: boolean;
    activeFilter: string | null;
    onFilterChange: (editalId: string | null) => void;
}

export function EditalFilters({ editais, topics, loading, activeFilter, onFilterChange }: EditalFiltersProps) {
    const getTopicCount = (editalId: string) => {
        return topics.filter(t => t.editalId === editalId).length;
    };

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!editais || editais.length === 0) {
        return <div className={styles.empty}>Nenhum edital encontrado</div>;
    }

    return (
        <div className={styles.filters}>
            <button
                key="todos"
                className={`${styles.filterBtn} ${activeFilter === null ? styles.active : ''}`}
                onClick={() => onFilterChange(null)}
            >
                <span className="material-icons">apps</span>
                Todos
                <span className={styles.count}>{topics.length}</span>
            </button>
            {editais.map(edital => {
                const count = getTopicCount(edital.id);
                const isActive = activeFilter === edital.id;
                return (
                    <button
                        key={edital.id}
                        className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
                        onClick={() => onFilterChange(edital.id)}
                    >
                        <span className="material-icons">folder</span>
                        {edital.nome}
                        <span className={styles.count}>{count}</span>
                    </button>
                );
            })}
        </div>
    );
}