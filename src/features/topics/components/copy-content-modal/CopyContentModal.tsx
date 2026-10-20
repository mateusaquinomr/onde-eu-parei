import { useState } from 'react';
import type { Content, Topic } from '../../types/topic.types';
import styles from './CopyContentModal.module.css';

interface CopyContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: Content | null;
    topics: Topic[];
    currentTopicId: string;
    onConfirm: (destinationTopicId: string) => void;
}

export function CopyContentModal({
    isOpen,
    onClose,
    content,
    topics,
    currentTopicId,
    onConfirm
}: CopyContentModalProps) {
    const [selectedTopicId, setSelectedTopicId] = useState('');

    if (!isOpen || !content) return null;

    const handleConfirm = () => {
        if (!selectedTopicId) return;
        onConfirm(selectedTopicId);
        setSelectedTopicId('');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Copiar conteúdo</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <p className={styles.description}>
                        Copiando <strong>"{content.title}"</strong> (com as anotações) para
                        um novo conteúdo independente em outro tópico. Status de conclusão,
                        tempo estudado e histórico não são copiados.
                    </p>

                    <label className={styles.label}>Tópico de destino</label>
                    <select
                        className={styles.select}
                        value={selectedTopicId}
                        onChange={(e) => setSelectedTopicId(e.target.value)}
                    >
                        <option value="">Selecione um tópico...</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>
                                {topic.name}{topic.id === currentTopicId ? ' (este tópico)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancelar
                    </button>
                    <button
                        className={styles.confirmButton}
                        onClick={handleConfirm}
                        disabled={!selectedTopicId}
                    >
                        Copiar
                    </button>
                </div>
            </div>
        </div>
    );
}