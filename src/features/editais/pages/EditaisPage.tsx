import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { EditalFilters } from '../components/edital-filters/EditalFilters';
import { EditalHeader } from '../components/edital-header/EditalHeader';
import { NewEditalModal } from '../components/new-edital/NewEditalModal';
import { ImportEditalModal } from '../components/import-edital/ImportEditalModal';
import { ArchivedEditaisModal } from '../components/archived-editais/ArchivedEditaisModal';
import { useEditais } from '../hooks/useEditais';
import { useTopics } from '@/features/topics/hooks/useTopics';
import { TopicList } from '@/features/topics/components/TopicList/TopicList';
import { CreateTopicModal } from '@/features/topics/components/CreateTopicModal/CreateTopicModal';
import type { Edital } from '../types/edital.types';
import styles from './EditaisPage.module.css';

const ACTIVE_FILTER_STORAGE_KEY = 'editais_active_filter';

export function EditaisPage() {
    const navigate = useNavigate();
    const { editais, loading: editaisLoading, refresh: refreshEditais, deleteEdital, updateEdital } = useEditais();
    const { topics, loading: topicsLoading, createTopic, createMultipleTopics, refresh: refreshTopics } = useTopics();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isNewEditalModalOpen, setIsNewEditalModalOpen] = useState(false);
    const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);
    const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
    const [editalParaEditar, setEditalParaEditar] = useState<Edital | null>(null);

    const [activeFilter, setActiveFilterState] = useState<string | null>(() => {
        return localStorage.getItem(ACTIVE_FILTER_STORAGE_KEY) || null;
    });

    const setActiveFilter = (editalId: string | null) => {
        setActiveFilterState(editalId);
        if (editalId) {
            localStorage.setItem(ACTIVE_FILTER_STORAGE_KEY, editalId);
        } else {
            localStorage.removeItem(ACTIVE_FILTER_STORAGE_KEY);
        }
    };

    useEffect(() => {
        refreshEditais();
        refreshTopics();
    }, []);


    useEffect(() => {
        if (editaisLoading) return;
        if (activeFilter && !editais.some(e => e.id === activeFilter)) {
            setActiveFilter(null);
        }
    }, [editaisLoading, editais, activeFilter]);

    const visibleEditais = editais.filter(e => !e.archived);
    const archivedEditais = editais.filter(e => e.archived);

    const filteredTopics = activeFilter
        ? topics.filter(t => t.editalId === activeFilter)
        : topics;

    const activeEdital = editais.find(e => e.id === activeFilter);

    const handleTopicClick = (topicId: string) => {
        navigate(`/topics/${topicId}`);
    };

    const handleCreateTopic = async (topicData: any) => {
        await createTopic(topicData);
        setIsCreateModalOpen(false);
        refreshTopics();
        refreshEditais();
    };

    const handleImportTopics = async (topicsData: any[]) => {
        await createMultipleTopics(topicsData);
        setIsImportModalOpen(false);
        refreshTopics();
        refreshEditais();
    };

    const handleOpenImportModal = () => {
        setIsNewEditalModalOpen(false);
        setIsImportModalOpen(true);
    };

    const handleNewEditalCreated = () => {
        refreshEditais();
        refreshTopics();
    };

    const handleEditEdital = (edital: Edital) => {
        setEditalParaEditar(edital);
        setIsNewEditalModalOpen(true);
    };

    const handleDeleteEdital = async (edital: Edital) => {
        const confirmar = window.confirm(`Tem certeza que deseja excluir o edital "${edital.nome}"?`);
        if (!confirmar) return;

        try {
            await deleteEdital(edital.id);
            setActiveFilter(null);
            refreshEditais();
            refreshTopics();
        } catch (err) {
            console.error('Erro ao excluir edital:', err);
            alert('Não foi possível excluir o edital. Tente novamente.');
        }
    };

    const handleArchiveEdital = async (edital: Edital) => {
        const confirmar = window.confirm(
            `Arquivar "${edital.nome}"? Ele sai da listagem principal, mas nada é apagado — você pode acessá-lo depois em "Arquivados".`
        );
        if (!confirmar) return;

        try {
            await updateEdital(edital.id, { archived: true, archivedAt: new Date() });
            if (activeFilter === edital.id) {
                setActiveFilter(null);
            }
        } catch (err) {
            console.error('Erro ao arquivar edital:', err);
            alert('Não foi possível arquivar o edital. Tente novamente.');
        }
    };

    const handleUnarchiveEdital = async (edital: Edital) => {
        try {
            await updateEdital(edital.id, { archived: false, archivedAt: null });
        } catch (err) {
            console.error('Erro ao desarquivar edital:', err);
            alert('Não foi possível desarquivar o edital. Tente novamente.');
        }
    };

    const handleOpenArchivedEdital = (edital: Edital) => {
        setIsArchivedModalOpen(false);
        setActiveFilter(edital.id);
    };

    const handleCloseNewEditalModal = () => {
        setIsNewEditalModalOpen(false);
        setEditalParaEditar(null);
    };

    const isLoading = editaisLoading || topicsLoading;

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Carregando...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Editais
                </Text>
                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        icon={<span className="material-icons">add</span>}
                        onClick={() => setIsNewEditalModalOpen(true)}
                    >
                        Novo edital
                    </Button>

                    <div className={styles.topMenuContainer}>
                        <button
                            className={styles.topMenuButton}
                            onClick={() => setIsTopMenuOpen(prev => !prev)}
                            aria-label="Mais opções"
                        >
                            <span className="material-icons">more_vert</span>
                        </button>

                        {isTopMenuOpen && (
                            <div className={styles.topMenuDropdown}>
                                <button
                                    className={styles.topMenuItem}
                                    onClick={() => {
                                        setIsTopMenuOpen(false);
                                        setIsArchivedModalOpen(true);
                                    }}
                                >
                                    <span className="material-icons">archive</span>
                                    Arquivados
                                    {archivedEditais.length > 0 && (
                                        <span className={styles.topMenuBadge}>{archivedEditais.length}</span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditalFilters
                editais={visibleEditais}
                topics={topics}
                loading={editaisLoading}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {activeFilter && activeEdital && (
                <EditalHeader
                    edital={activeEdital}
                    onEdit={() => handleEditEdital(activeEdital)}
                    onArchive={() => handleArchiveEdital(activeEdital)}
                    onDelete={() => handleDeleteEdital(activeEdital)}
                />
            )}

            {topics.length === 0 ? (
                <div className={styles.emptyState}>
                    <Text variant="body" className={styles.emptyText}>
                        Adicione seus tópicos de estudo{' '}
                        <button
                            className={styles.inlineButton}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            manualmente
                        </button>
                        {' ou '}
                        <button
                            className={styles.inlineButton}
                            onClick={() => setIsNewEditalModalOpen(true)}
                        >
                            importe
                        </button>
                        {' de um template.'}
                    </Text>
                </div>
            ) : (
                <div className={styles.topicsContainer}>
                    <div className={styles.topicsHeader}>
                        <Text variant="cardTitle">
                            Tópicos {activeFilter && activeEdital ? `- ${activeEdital.nome}` : ''}
                        </Text>
                        <Button
                            variant="primary"
                            icon={<span className="material-icons">add</span>}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Adicionar tópico
                        </Button>
                    </div>

                    <TopicList
                        topics={filteredTopics}
                        onTopicClick={handleTopicClick}
                    />
                </div>
            )}

            <NewEditalModal
                isOpen={isNewEditalModalOpen}
                onClose={handleCloseNewEditalModal}
                onImportClick={handleOpenImportModal}
                onEditalCreated={handleNewEditalCreated}
                editalParaEditar={editalParaEditar}
            />

            <CreateTopicModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateTopic}
            />

            <ImportEditalModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportTopics}
            />

            <ArchivedEditaisModal
                isOpen={isArchivedModalOpen}
                onClose={() => setIsArchivedModalOpen(false)}
                archivedEditais={archivedEditais}
                onUnarchive={handleUnarchiveEdital}
                onOpen={handleOpenArchivedEdital}
            />
        </div>
    );
}