import { useState } from 'react';
import { ContentEditorRow } from './ContentEditorRow';
import styles from './TopicEditorRow.module.css';

interface Content {
    id: string;
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

interface TopicEditorRowProps {
    id: string;
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    contents: Content[];
    index: number;
    onUpdate: (id: string, field: string, value: any) => void;
    onDelete: (id: string) => void;
    onUpdateContent: (topicId: string, contentId: string, title: string, importance: 'pouco' | 'normal' | 'muita') => void;
    onDeleteContent: (topicId: string, contentId: string) => void;
    onAddContent: (topicId: string, newContent: { title: string; importance: 'pouco' | 'normal' | 'muita' }) => void;
}

const notebookOptions = [
    { label: 'Azul', value: 'azul' },
    { label: 'Amarelo', value: 'amarelo' },
    { label: 'Vermelho', value: 'vermelho' },
    { label: 'Verde', value: 'verde' },
    { label: 'Rosa', value: 'rosa' },
    { label: 'Preto', value: 'preto' }
];

const difficultyOptions = [
    { label: 'Fácil', value: 'facil' },
    { label: 'Médio', value: 'medio' },
    { label: 'Difícil', value: 'dificil' }
];

const notebookColors = {
    azul: '#3b83f6f1',
    amarelo: '#F59E0B',
    vermelho: '#EF4444',
    verde: '#10B981',
    rosa: '#EC4899',
    preto: '#1F2937'
};

export function TopicEditorRow({
    id,
    name,
    notebookColor,
    difficulty,
    contents,
    index,
    onUpdate,
    onDelete,
    onUpdateContent,
    onDeleteContent,
    onAddContent
}: TopicEditorRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState(name);
    const [newContentTitle, setNewContentTitle] = useState('');
    const [newContentImportance, setNewContentImportance] = useState<'pouco' | 'normal' | 'muita'>('normal');
    const [showAddContent, setShowAddContent] = useState(false);

    const handleSaveName = () => {
        if (editName.trim()) {
            onUpdate(id, 'name', editName);
            setIsEditingName(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveName();
        } else if (e.key === 'Escape') {
            setEditName(name);
            setIsEditingName(false);
        }
    };

    const handleAddContent = () => {
        if (newContentTitle.trim()) {
            onAddContent(id, {
                title: newContentTitle,
                importance: newContentImportance
            });
            setNewContentTitle('');
            setNewContentImportance('normal');
            setShowAddContent(false);
        }
    };

    return (
        <div className={styles.topicCard}>

            <div className={styles.topicHeader}>
                <button
                    className={styles.expandButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? 'Recolher' : 'Expandir'}
                >
                    <span className="material-icons">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                </button>

                <div className={styles.topicInfo}>
                    {isEditingName ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={handleKeyDown}
                            className={styles.topicNameInput}
                            autoFocus
                        />
                    ) : (
                        <div
                            className={styles.topicName}
                            onDoubleClick={() => setIsEditingName(true)}
                            title="Duplo clique para editar"
                        >
                            <span className={styles.topicIndex}>{index}</span>
                            {name}
                            <span className={styles.editIcon}>edit</span>
                        </div>
                    )}
                </div>

                <select
                    value={notebookColor}
                    onChange={(e) => onUpdate(id, 'notebookColor', e.target.value)}
                    className={styles.topicSelect}
                    style={{ borderColor: notebookColors[notebookColor] }}
                >
                    {notebookOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <select
                    value={difficulty}
                    onChange={(e) => onUpdate(id, 'difficulty', e.target.value)}
                    className={styles.topicSelect}
                >
                    {difficultyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <button
                    onClick={() => onDelete(id)}
                    className={styles.deleteTopicBtn}
                    title="Excluir tópico"
                >
                    <span className="material-icons">delete</span>
                </button>
            </div>

            {isExpanded && (
                <div className={styles.topicContents}>
                    <div className={styles.contentsHeader}>
                        <span className={styles.contentsTitle}>

                            Conteúdos ({contents.length})
                        </span>
                    </div>

                    <div className={styles.contentsList}>
                        {contents.map((content, idx) => (
                            <ContentEditorRow
                                key={content.id}
                                id={content.id}
                                title={content.title}
                                importance={content.importance}
                                index={idx + 1}
                                onUpdate={(contentId, title, importance) =>
                                    onUpdateContent(id, contentId, title, importance)
                                }
                                onDelete={(contentId) => onDeleteContent(id, contentId)}
                            />
                        ))}
                    </div>

                    {showAddContent ? (
                        <div className={styles.addContentForm}>
                            <input
                                type="text"
                                value={newContentTitle}
                                onChange={(e) => setNewContentTitle(e.target.value)}
                                placeholder="Nome do conteúdo..."
                                className={styles.addContentInput}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddContent()}
                                autoFocus
                            />
                            <select
                                value={newContentImportance}
                                onChange={(e) => setNewContentImportance(e.target.value as any)}
                                className={styles.addContentSelect}
                            >
                                <option value="pouco">Pouco importante</option>
                                <option value="normal">Normal</option>
                                <option value="muita">Muito importante</option>
                            </select>
                            <button
                                onClick={handleAddContent}
                                className={styles.addContentConfirm}
                                disabled={!newContentTitle.trim()}
                            >
                                <span className="material-icons">check</span>
                            </button>
                            <button
                                onClick={() => setShowAddContent(false)}
                                className={styles.addContentCancel}
                            >
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAddContent(true)}
                            className={styles.addContentBtn}
                        >
                            <span className="material-icons">add</span>
                            Adicionar conteúdo
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}