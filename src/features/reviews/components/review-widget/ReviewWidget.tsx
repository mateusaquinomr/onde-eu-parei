import { useState } from 'react';
import type { Topic } from '@/features/topics/types/topic.types';
import { useDueReviews, useAllScheduledReviews, useCompletedReviews } from '../../hooks/useReviews';
import { REVIEW_INTERVALS_DAYS } from '../../types/review.types';
import styles from './ReviewWidget.module.css';

interface ReviewWidgetProps {
    topics: Topic[];
    onCompleteReview: (topicId: string, contentId: string) => void;
}

type ReviewTab = 'todos' | 'hoje' | 'feitos';

export function ReviewWidget({ topics, onCompleteReview }: ReviewWidgetProps) {
    const [activeTab, setActiveTab] = useState<ReviewTab>('hoje');

    const dueReviews = useDueReviews(topics);
    const allReviews = useAllScheduledReviews(topics);
    const completedReviews = useCompletedReviews(topics);

    const items = activeTab === 'hoje' ? dueReviews : activeTab === 'todos' ? allReviews : completedReviews;

    const emptyMessage = activeTab === 'feitos'
        ? 'Nenhuma revisão feita ainda'
        : activeTab === 'todos'
            ? 'Nenhuma revisão agendada'
            : 'Nenhuma revisão pendente hoje';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Revisões</h3>
                {dueReviews.length > 0 && (
                    <span className={styles.countBadge}>{dueReviews.length}</span>
                )}
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'todos' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('todos')}
                >
                    Todos
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'hoje' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('hoje')}
                >
                    Hoje
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'feitos' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('feitos')}
                >
                    Feitos
                </button>
            </div>

            {items.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className="material-icons">event_available</span>
                    <p>{emptyMessage}</p>
                </div>
            ) : (
                <ul className={styles.list}>
                    {items.map((item) => (
                        <li
                            key={item.contentId}
                            className={`${styles.item} ${item.daysOverdue > 0 ? styles.overdueItem : ''}`}
                        >
                            <div className={styles.itemInfo}>
                                <span className={styles.topicName}>{item.topicName}</span>
                                <span className={styles.contentTitle}>{item.contentTitle}</span>
                                <span className={styles.stageLabel}>
                                    {activeTab === 'feitos'
                                        ? `${item.reviewCount} ${item.reviewCount === 1 ? 'revisão feita' : 'revisões feitas'}`
                                        : `Revisão ${item.stage + 1} de ${REVIEW_INTERVALS_DAYS.length} `}
                                    {activeTab !== 'feitos' && item.daysOverdue > 0 && (
                                        <span className={styles.overdueTag}>
                                            · {item.daysOverdue} {item.daysOverdue === 1 ? 'dia' : 'dias'} atrasada
                                        </span>
                                    )}
                                </span>
                            </div>

                            {activeTab !== 'feitos' && (
                                <button
                                    className={styles.completeButton}
                                    onClick={() => onCompleteReview(item.topicId, item.contentId)}
                                    title="Marcar como revisado"
                                >
                                    <span className="material-icons">check</span>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}