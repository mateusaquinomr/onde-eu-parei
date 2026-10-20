import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Text } from '@/shared/components/ui/Text/Text';
import { TopicEditorRow } from './TopicEditorRow';
import { enemTopicsData, type EnemTopic } from '../../data/templates/enemTopicsData';
import { aleceSMDTopicsData, type AleceTopic } from '../../data/templates/aleceSMDTopicsData';
import { ibgeTopicsData, type IbgeTopic } from '../../data/templates/ibgeTopicsData';
import { useEditais } from '../../hooks/useEditais';
import styles from './ImportEditalModal.module.css';

interface ImportEditalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (topics: any[]) => void;
}

type Step = 'template' | 'editor';

interface EditableContent {
    id: string;
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

interface EditableTopic {
    id: string;
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    editalId: string;
    contents: EditableContent[];
}

export function ImportEditalModal({ isOpen, onClose, onImport }: ImportEditalModalProps) {
    const [step, setStep] = useState<Step>('template');
    const [selectedTemplate, setSelectedTemplate] = useState<'enem' | 'alece-smd' | 'ibge' | null>(null);
    const [topics, setTopics] = useState<EditableTopic[]>([]);
    const { createEdital, editais, refresh: refreshEditais } = useEditais();

    if (!isOpen) return null;

    const handleSelectTemplate = async (template: 'enem' | 'alece-smd' | 'ibge') => {
        setSelectedTemplate(template);

        if (template === 'enem') {
            let editalId = '';

            try {
                await refreshEditais();
                const editalEncontrado = editais.find(e => e.nome === 'ENEM');

                if (!editalEncontrado) {
                    const novoEdital = await createEdital({
                        nome: 'ENEM',
                        banca: 'INEP',
                        dataProva: new Date('2026-11-05'),
                        local: 'Nacional'
                    });
                    editalId = novoEdital.id;
                    await refreshEditais();
                } else {
                    editalId = editalEncontrado.id;
                }
            } catch (error) {
                console.error('Erro ao criar/verificar edital:', error);
                const editalExistente = editais.find(e => e.nome === 'ENEM');
                editalId = editalExistente ? editalExistente.id : 'enem';
            }

            const loadedTopics: EditableTopic[] = enemTopicsData.map((topic: EnemTopic) => ({
                id: crypto.randomUUID(),
                name: topic.name,
                notebookColor: topic.notebookColor,
                difficulty: topic.difficulty,
                editalId: editalId,
                contents: topic.contents.map(content => ({
                    id: crypto.randomUUID(),
                    title: content.title,
                    importance: content.importance
                }))
            }));
            setTopics(loadedTopics);
        }

        if (template === 'alece-smd') {
            let editalId = '';

            try {
                await refreshEditais();
                const editalEncontrado = editais.find(e => e.nome === 'ALECE - SMD');

                if (!editalEncontrado) {
                    const novoEdital = await createEdital({
                        nome: 'ALECE - SMD',
                        banca: 'ALECE',
                        dataProva: new Date('2026-12-15'),
                        local: 'Ceará'
                    });
                    editalId = novoEdital.id;
                    await refreshEditais();
                } else {
                    editalId = editalEncontrado.id;
                }
            } catch (error) {
                console.error('Erro ao criar/verificar edital:', error);
                const editalExistente = editais.find(e => e.nome === 'ALECE - SMD');
                editalId = editalExistente ? editalExistente.id : 'alece-smd';
            }

            const loadedTopics: EditableTopic[] = aleceSMDTopicsData.map((topic: AleceTopic) => ({
                id: crypto.randomUUID(),
                name: topic.name,
                notebookColor: topic.notebookColor,
                difficulty: topic.difficulty,
                editalId: editalId,
                contents: topic.contents.map(content => ({
                    id: crypto.randomUUID(),
                    title: content.title,
                    importance: content.importance
                }))
            }));
            setTopics(loadedTopics);
        }

        if (template === 'ibge') {
            let editalId = '';

            try {
                await refreshEditais();
                const editalEncontrado = editais.find(e => e.nome === 'IBGE - Analista Censitário - TI');

                if (!editalEncontrado) {
                    const novoEdital = await createEdital({
                        nome: 'IBGE - Analista Censitário - TI',
                        banca: 'IBGE',
                        dataProva: new Date('2026-12-15'),
                        local: 'Nacional'
                    });
                    editalId = novoEdital.id;
                    await refreshEditais();
                } else {
                    editalId = editalEncontrado.id;
                }
            } catch (error) {
                console.error('Erro ao criar/verificar edital:', error);
                const editalExistente = editais.find(e => e.nome === 'IBGE - Analista Censitário - TI');
                editalId = editalExistente ? editalExistente.id : 'ibge';
            }

            const loadedTopics: EditableTopic[] = ibgeTopicsData.map((topic: IbgeTopic) => ({
                id: crypto.randomUUID(),
                name: topic.name,
                notebookColor: topic.notebookColor,
                difficulty: topic.difficulty,
                editalId: editalId,
                contents: topic.contents.map(content => ({
                    id: crypto.randomUUID(),
                    title: content.title,
                    importance: content.importance
                }))
            }));
            setTopics(loadedTopics);
        }

        setStep('editor');
    };

    const handleUpdateTopic = (topicId: string, field: string, value: any) => {
        setTopics(prev => prev.map(topic =>
            topic.id === topicId ? { ...topic, [field]: value } : topic
        ));
    };

    const handleDeleteTopic = (topicId: string) => {
        setTopics(prev => prev.filter(topic => topic.id !== topicId));
    };

    const handleUpdateContent = (topicId: string, contentId: string, title: string, importance: 'pouco' | 'normal' | 'muita') => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: topic.contents.map(content =>
                    content.id === contentId ? { ...content, title, importance } : content
                )
            };
        }));
    };

    const handleDeleteContent = (topicId: string, contentId: string) => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: topic.contents.filter(content => content.id !== contentId)
            };
        }));
    };

    const handleAddContent = (topicId: string, newContent: { title: string; importance: 'pouco' | 'normal' | 'muita' }) => {
        setTopics(prev => prev.map(topic => {
            if (topic.id !== topicId) return topic;
            return {
                ...topic,
                contents: [...topic.contents, {
                    id: crypto.randomUUID(),
                    title: newContent.title,
                    importance: newContent.importance
                }]
            };
        }));
    };

    const handleImport = () => {
        const topicsToImport = topics.map(topic => ({
            name: topic.name,
            notebookColor: topic.notebookColor,
            difficulty: topic.difficulty,
            editalId: topic.editalId,
            tags: [],
            contents: topic.contents.map(content => ({
                title: content.title,
                importance: content.importance
            }))
        }));

        onImport(topicsToImport);
        handleClose();
    };

    const handleClose = () => {
        setStep('template');
        setSelectedTemplate(null);
        setTopics([]);
        onClose();
    };

    if (step === 'template') {
        return (
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Importar edital</h2>
                        <button className={styles.closeButton} onClick={handleClose}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.templatesGrid}>
                            <button
                                className={styles.templateCard}
                                onClick={() => handleSelectTemplate('enem')}
                            >
                                <h3 className={styles.templateTitle}>ENEM</h3>
                                <p className={styles.templateDescription}>
                                    Modelo com matérias da matriz curricular oficial do ENEM
                                </p>
                            </button>

                            <button
                                className={styles.templateCard}
                                onClick={() => handleSelectTemplate('alece-smd')}
                            >
                                <h3 className={styles.templateTitle}>ALECE - SMD</h3>
                                <p className={styles.templateDescription}>
                                    Analista Legislativo - Sistemas e Mídias Digitais
                                </p>
                            </button>

                            <button
                                className={styles.templateCard}
                                onClick={() => handleSelectTemplate('ibge')}
                            >
                                <h3 className={styles.templateTitle}>IBGE - TI</h3>
                                <p className={styles.templateDescription}>
                                    Analista Censitário - Tecnologia da Informação
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button variant="ghost" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Importar tópicos - {selectedTemplate === 'enem' ? 'ENEM' : selectedTemplate === 'alece-smd' ? 'ALECE - SMD' : 'IBGE - TI'}
                    </h2>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.topicsEditor}>
                        <div className={styles.editorHeader}>
                            <div></div>
                            <div className={styles.headerTopic}>Tópico</div>
                            <div className={styles.headerCaderno}>Caderno</div>
                            <div className={styles.headerDifficulty}>Dificuldade</div>
                            <div className={styles.headerActions}></div>
                        </div>

                        <div className={styles.topicsList}>
                            {topics.map((topic, idx) => (
                                <TopicEditorRow
                                    key={topic.id}
                                    id={topic.id}
                                    name={topic.name}
                                    notebookColor={topic.notebookColor}
                                    difficulty={topic.difficulty}
                                    contents={topic.contents}
                                    index={idx + 1}
                                    onUpdate={handleUpdateTopic}
                                    onDelete={handleDeleteTopic}
                                    onUpdateContent={handleUpdateContent}
                                    onDeleteContent={handleDeleteContent}
                                    onAddContent={handleAddContent}
                                />
                            ))}
                        </div>

                        {topics.length === 0 && (
                            <div className={styles.emptyTopics}>
                                <Text variant="body">Nenhum tópico para importar</Text>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button variant="ghost" onClick={() => setStep('template')}>
                        <span className="material-icons">arrow_back</span>
                        Voltar
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleImport}
                        disabled={topics.length === 0}
                    >
                        Importar {topics.length} tópico(s)
                    </Button>
                </div>
            </div>
        </div>
    );
}