import { Text } from '@/shared/components/ui/Text/Text';
import type { Topic } from '../../types/topic.types';
import { CircularProgress } from '../CircularProgress/CircularProgress';
import styles from './TopicCard.module.css';

interface TopicCardProps {
    topic: Topic;
    onClick: () => void;
}

const notebookColorMap = {
    azul: '#3B82F6',
    amarelo: '#F59E0B',
    vermelho: '#EF4444',
    verde: '#10B981',
    rosa: '#EC4899',
    preto: '#1F2937'
};

const difficultyLabels = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil'
};

const difficultyColors = {
    facil: '#10b981',
    medio: '#f59e0b',
    dificil: '#ef4444'
};

export function TopicCard({ topic, onClick }: TopicCardProps) {
    const completedContents = topic.contents.filter(c => c.completed).length;
    const totalContents = topic.contents.length;
    const progress = totalContents > 0
        ? Math.round((completedContents / totalContents) * 100)
        : 0;

    const recentContents = topic.contents.slice(0, 2);

    const formatLastAccessed = (date?: Date | string | null) => {
        if (!date) return 'Nunca';

        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
                return 'Data inválida';
            }
            return dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit'
            });
        } catch {
            return 'Data inválida';
        }
    };

    const formatTotalMinutes = (minutes?: number) => {
        if (minutes === undefined || minutes === null) return '0min';

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}min`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${mins}min`;
        }
    };

    return (
        <div
            className={styles.card}
            onClick={onClick}
        >

            <div
                className={styles.colorBar}
                style={{ backgroundColor: `${notebookColorMap[topic.notebookColor]}80` }}
            >
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
                <div className={styles.colorBarCircle} />
            </div>

            <div className={styles.header}>
                <Text as="h3" variant="cardTitle" className={styles.title}>
                    {topic.name}
                </Text>
                <span
                    className={styles.badge}
                    style={{ backgroundColor: `${difficultyColors[topic.difficulty]}80` }}
                >
                    {difficultyLabels[topic.difficulty]}
                </span>
            </div>

            {topic.tags.length > 0 && (
                <div className={styles.tags}>
                    {topic.tags.map(tag => (
                        <span key={tag.id} className={styles.tag}>
                            {tag.label}
                        </span>
                    ))}
                </div>
            )}

            <div className={styles.progressContainer}>
                <CircularProgress
                    progress={progress}
                    completed={completedContents}
                    total={totalContents}
                    size={90}
                    strokeWidth={6}
                />

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className={styles.statValueWrapper}>
                            <span className="material-icons" style={{ fontSize: '12px', color: '#9CA3AF' }}>event</span>
                            <Text variant="caption" className={styles.statLabel}>
                                último acesso
                            </Text>
                        </div>
                        <Text variant="body" className={styles.statValue}>
                            {formatLastAccessed(topic.lastAccessed)}
                        </Text>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.statItem}>
                        <div className={styles.statValueWrapper}>
                            <span className="material-icons" style={{ fontSize: '12px', color: '#9CA3AF' }}>schedule</span>
                            <Text variant="caption" className={styles.statLabel}>
                                tempo total
                            </Text>
                        </div>
                        <Text variant="body" className={styles.statValue}>
                            {formatTotalMinutes(topic.totalMinutes)}
                        </Text>
                    </div>
                </div>
            </div>

            <div className={styles.contentsSection}>
                <div className={styles.contentsHeader}>
                    <Text variant="label" className={styles.contentsLabel}>
                        Conteúdos ({totalContents})
                    </Text>
                </div>

                {recentContents.length > 0 ? (
                    <div className={styles.contentsList}>
                        {recentContents.map(content => (
                            <div key={content.id} className={styles.contentItem}>
                                <span className={`${styles.contentStatus} ${content.completed ? styles.completed : ''}`}>
                                    {content.completed ? (
                                        <span className="material-icons" style={{ fontSize: '14px' }}>check_circle</span>
                                    ) : (
                                        <span className="material-icons" style={{ fontSize: '14px' }}>radio_button_unchecked</span>
                                    )}
                                </span>
                                <Text variant="caption" className={styles.contentTitle}>
                                    {content.title}
                                </Text>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Text variant="caption" className={styles.emptyContents}>
                        Nenhum conteúdo adicionado
                    </Text>
                )}

                {totalContents > 2 && (
                    <div className={styles.viewAllContainer}>
                        <Text variant="caption" className={styles.viewAllText}>
                            ver todos os {totalContents} conteúdos <span className={styles.arrow}>v</span>
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
}