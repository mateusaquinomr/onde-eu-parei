import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { Select } from '@/shared/components/ui/Form/Select';
import { EditableTitle } from '@/shared/components/ui/EditableTitle/EditableTitle';
import { EditableMetadata } from '@/shared/components/ui/EditableMetadata/EditableMetadata';
import { useTopics } from '../hooks/useTopics';
import { useCycle } from '@/features/cycle/hooks/useCycle';
import { studyTimerService } from '@/features/study/services/studyTimerService';
import { ContentList } from '../components/ContentList/ContentList';
import { CircularProgress } from '../components/CircularProgress/CircularProgress';
import { CopyContentModal } from '../components/copy-content-modal/CopyContentModal';
import { calculateNextReviewDate } from '@/features/reviews/services/reviewService';
import type { Content, ImportanceLevel, NotebookColor, DifficultyLevel, ChecklistItem, QuestionList } from '../types/topic.types';
import styles from './TopicDetailPage.module.css';

const importanceOptions = [
    { label: 'Pouco importante', value: 'pouco' },
    { label: 'Normal', value: 'normal' },
    { label: 'Muito importante', value: 'muita' }
];

export function TopicDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { topics, loading, updateTopic, updateLastAccessed, deleteTopic } = useTopics();
    const { currentCycle, decrementBlockMinutes, completeBlock } = useCycle();
    const topic = topics.find(t => t.id === id);
    const [showAddContent, setShowAddContent] = useState(false);
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentImportance, setNewContentImportance] = useState<ImportanceLevel>('normal');
    const [showMenu, setShowMenu] = useState(false);
    const [contentToCopy, setContentToCopy] = useState<Content | null>(null);

    const lastAccessedFor = useRef<string | null>(null);

    useEffect(() => {
        if (!id || !topic || lastAccessedFor.current === id) return;
        lastAccessedFor.current = id;
        updateLastAccessed(id);
    }, [id, topic]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMenu) {
                const menu = document.querySelector(`.${styles.menuDropdown}`);
                const button = document.querySelector(`.${styles.menuButton}`);
                if (menu && !menu.contains(event.target as Node) && button && !button.contains(event.target as Node)) {
                    setShowMenu(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (!topic) {
        return (
            <div className={styles.notFound}>
                <Text variant="body">Tópico não encontrado</Text>
                <Button variant="primary" onClick={() => navigate('/topics')}>
                    Voltar
                </Button>
            </div>
        );
    }

    const activeBlockForTopic = currentCycle?.blocks.find(
        b => b.topicId === topic.id && !b.completed
    ) || null;

    const handleBlockMinuteTick = async (minutes: number) => {
        if (!activeBlockForTopic) return;
        await decrementBlockMinutes(activeBlockForTopic.id, minutes);
    };

    const handleBlockCompleteBlock = async (blockId: string) => {
        await completeBlock(blockId);
        studyTimerService.clearProgress(blockId);
    };

    const completedContents = topic.contents.filter(c => c.completed).length;
    const totalContents = topic.contents.length;
    const progress = totalContents > 0
        ? Math.round((completedContents / totalContents) * 100)
        : 0;

    const handleGoBack = () => {
        navigate('/editais');
    };

    const handleDeleteTopic = async () => {
        const confirmed = window.confirm(`Tem certeza que deseja deletar o tópico "${topic.name}"? Esta ação não pode ser desfeita.`);
        if (confirmed) {
            await deleteTopic(topic.id);
            navigate('/topics');
        }
        setShowMenu(false);
    };

    const handleToggleComplete = (contentId: string) => {
        const now = new Date();
        const updatedContents = topic.contents.map(c => {
            if (c.id !== contentId) return c;
            const completed = !c.completed;

            if (completed) {

                return {
                    ...c,
                    completed: true,
                    studyData: {
                        ...c.studyData,
                        completedAt: now,
                        nextReviewDate: calculateNextReviewDate(now, c.studyData?.reviewHistory)
                    }
                };
            }

            return {
                ...c,
                completed: false,
                studyData: {
                    ...c.studyData,
                    nextReviewDate: null
                }
            };
        });
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleUpdateContent = (contentId: string, title: string, importance: ImportanceLevel) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId ? { ...c, title, importance } : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleDeleteContent = (contentId: string) => {
        const updatedContents = topic.contents.filter(c => c.id !== contentId);
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleCopyToTopic = (content: Content) => {
        setContentToCopy(content);
    };


    const handleConfirmCopy = async (destinationTopicId: string) => {
        if (!contentToCopy) return;

        const destinationTopic = topics.find(t => t.id === destinationTopicId);
        if (!destinationTopic) return;

        const newContent: Content = {
            id: crypto.randomUUID(),
            title: contentToCopy.title,
            importance: contentToCopy.importance,
            completed: false,
            order: destinationTopic.contents.length,
            createdAt: new Date(),
            checklist: [],
            studyData: {
                totalTimeSpent: 0,
                notes: contentToCopy.studyData?.notes || '',
                startedAt: null,
                completedAt: null,
                lastReviewDate: null,
                nextReviewDate: null,
                reviewHistory: [],
                questionLists: []
            }
        };

        await updateTopic(destinationTopicId, {
            contents: [...destinationTopic.contents, newContent]
        });

        setContentToCopy(null);
    };

    const handleReorderContents = (reorderedContents: Content[]) => {
        updateTopic(topic.id, { contents: reorderedContents });
    };

    const handleUpdateTopicName = (newName: string) => {
        updateTopic(topic.id, { name: newName });
    };

    const handleUpdateNotebook = (color: NotebookColor) => {
        updateTopic(topic.id, { notebookColor: color });
    };

    const handleUpdateDifficulty = (difficulty: DifficultyLevel) => {
        updateTopic(topic.id, { difficulty });
    };

    const handleUpdateChecklist = (contentId: string, items: ChecklistItem[]) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId ? { ...c, checklist: items } : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleUpdateNotes = (contentId: string, notes: string) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    studyData: {
                        ...c.studyData,
                        notes
                    }
                }
                : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleUpdateQuestions = (contentId: string, questionLists: QuestionList[]) => {
        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    studyData: {
                        ...c.studyData,
                        questionLists
                    }
                }
                : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleCompleteReview = (contentId: string, durationMinutes: number) => {
        const content = topic.contents.find(c => c.id === contentId);
        if (!content) return;

        const now = new Date();
        const newHistoryEntry = {
            id: crypto.randomUUID(),
            date: now,
            duration: durationMinutes,
            notes: ''
        };
        const updatedHistory = [...(content.studyData?.reviewHistory || []), newHistoryEntry];

        const updatedContents = topic.contents.map(c =>
            c.id === contentId
                ? {
                    ...c,
                    studyData: {
                        ...c.studyData,
                        lastReviewDate: now,
                        nextReviewDate: calculateNextReviewDate(now, updatedHistory),
                        reviewHistory: updatedHistory
                    }
                }
                : c
        );
        updateTopic(topic.id, { contents: updatedContents });
    };

    const handleAddContent = () => {
        if (!newContentTitle.trim()) return;

        const newContent: Content = {
            id: crypto.randomUUID(),
            title: newContentTitle,
            importance: newContentImportance,
            completed: false,
            order: topic.contents.length,
            createdAt: new Date(),
            checklist: [],
            studyData: {
                totalTimeSpent: 0,
                notes: '',
                startedAt: null,
                completedAt: null,
                lastReviewDate: null,
                nextReviewDate: null,
                reviewHistory: [],
                questionLists: []
            }
        };

        const updatedContents = [...topic.contents, newContent];
        updateTopic(topic.id, { contents: updatedContents });

        setNewContentTitle('');
        setNewContentImportance('normal');
        setShowAddContent(false);
    };

    const formatLastAccessed = (date?: Date | string | null) => {
        if (!date) return 'Nunca';

        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
                return 'Data inválida';
            }
            return dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const formatTotalHours = (hours?: number) => {
        if (hours === undefined || hours === null) return '0';
        return hours.toFixed(1);
    };

    const notebookOptions = [
        { label: 'Azul', value: 'azul' as const, color: '#3B82F6' },
        { label: 'Amarelo', value: 'amarelo' as const, color: '#F59E0B' },
        { label: 'Vermelho', value: 'vermelho' as const, color: '#EF4444' },
        { label: 'Verde', value: 'verde' as const, color: '#10B981' },
        { label: 'Rosa', value: 'rosa' as const, color: '#EC4899' },
        { label: 'Preto', value: 'preto' as const, color: '#1F2937' }
    ];

    const difficultyOptions = [
        { label: 'Fácil', value: 'facil' as const },
        { label: 'Médio', value: 'medio' as const },
        { label: 'Difícil', value: 'dificil' as const }
    ];

    const metadataFields = [
        {
            id: 'notebook',
            label: 'Caderno',
            value: topic.notebookColor,
            type: 'select' as const,
            options: notebookOptions
        },
        {
            id: 'difficulty',
            label: 'Dificuldade',
            value: topic.difficulty,
            type: 'select' as const,
            options: difficultyOptions
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.breadcrumb}>
                    <Button
                        variant="ghost"
                        icon={<span className="material-icons">arrow_back</span>}
                        onClick={handleGoBack}
                        className={styles.backButton}
                    />
                    <Text variant="caption" className={styles.breadcrumbText}>
                        Tópicos
                    </Text>
                </div>

                <div className={styles.menuContainer}>
                    <button
                        className={styles.menuButton}
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label="Opções"
                    >
                        <span className="material-icons">more_vert</span>
                    </button>

                    {showMenu && (
                        <div className={styles.menuDropdown}>
                            <button
                                className={`${styles.menuItem} ${styles.deleteItem}`}
                                onClick={handleDeleteTopic}
                            >
                                <span className="material-icons">delete</span>
                                Deletar tópico
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.titleSection}>
                <EditableTitle
                    value={topic.name}
                    onSave={handleUpdateTopicName}
                    variant="pageTitle"
                />
            </div>

            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    <div className={styles.progressCard}>
                        <CircularProgress
                            progress={progress}
                            completed={completedContents}
                            total={totalContents}
                            size={140}
                            strokeWidth={8}
                        />

                        <div className={styles.progressStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statValueWrapper}>
                                    <span className="material-icons" style={{ fontSize: '14px', color: '#9CA3AF' }}>event</span>
                                    <Text variant="caption" className={styles.statLabel}>
                                        último acesso
                                    </Text>
                                </div>
                                <Text variant="cardSectionTitle" className={styles.statValue}>
                                    {formatLastAccessed(topic.lastAccessed)}
                                </Text>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statValueWrapper}>
                                    <span className="material-icons" style={{ fontSize: '14px', color: '#9CA3AF' }}>schedule</span>
                                    <Text variant="caption" className={styles.statLabel}>
                                        horas totais
                                    </Text>
                                </div>
                                <Text variant="cardSectionTitle" className={styles.statValue}>
                                    {formatTotalHours(topic.totalMinutes)}h
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className={styles.metadataCard}>
                        <EditableMetadata
                            fields={metadataFields}
                            onSave={(fieldId: string, value: any) => {
                                if (fieldId === 'notebook') {
                                    handleUpdateNotebook(value as NotebookColor);
                                } else if (fieldId === 'difficulty') {
                                    handleUpdateDifficulty(value as DifficultyLevel);
                                }
                            }}
                        />

                        {topic.tags.length > 0 && (
                            <div className={styles.tagsSection}>
                                <Text variant="label" className={styles.metadataLabel}>
                                    Etiquetas
                                </Text>
                                <div className={styles.tagsContainer}>
                                    {topic.tags.map(tag => (
                                        <span key={tag.id} className={styles.tag}>
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.contentsHeader}>
                        <Text variant="cardTitle">Conteúdos</Text>
                        <Button
                            variant="primary"
                            icon={<span className="material-icons">add</span>}
                            onClick={() => setShowAddContent(!showAddContent)}
                        >
                            {showAddContent ? 'Cancelar' : 'Conteúdo'}
                        </Button>
                    </div>

                    {showAddContent && (
                        <div className={styles.addContent}>
                            <div className={styles.addContentRow}>
                                <div className={styles.flex2}>
                                    <Input
                                        value={newContentTitle}
                                        onChange={(e) => setNewContentTitle(e.target.value)}
                                        placeholder="Nome do conteúdo..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddContent())}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.flex1}>
                                    <Select
                                        value={newContentImportance}
                                        onChange={(value) => setNewContentImportance(value as ImportanceLevel)}
                                        options={importanceOptions}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    icon={<span className="material-icons">add</span>}
                                    onClick={handleAddContent}
                                    disabled={!newContentTitle.trim()}
                                />
                            </div>
                        </div>
                    )}

                    <ContentList
                        topicId={topic.id}
                        topicName={topic.name}
                        contents={topic.contents}
                        isEditing={true}
                        onToggleComplete={handleToggleComplete}
                        onUpdateContent={handleUpdateContent}
                        onDeleteContent={handleDeleteContent}
                        onCopyToTopic={handleCopyToTopic}
                        activeBlock={activeBlockForTopic}
                        onBlockMinuteTick={handleBlockMinuteTick}
                        onBlockCompleteBlock={handleBlockCompleteBlock}
                        onReorder={handleReorderContents}
                        onUpdateChecklist={handleUpdateChecklist}
                        onUpdateNotes={handleUpdateNotes}
                        onUpdateQuestions={handleUpdateQuestions}
                        onCompleteReview={handleCompleteReview}
                    />
                </div>
            </div>

            <CopyContentModal
                isOpen={contentToCopy !== null}
                onClose={() => setContentToCopy(null)}
                content={contentToCopy}
                topics={topics}
                currentTopicId={topic.id}
                onConfirm={handleConfirmCopy}
            />
        </div>
    );
}