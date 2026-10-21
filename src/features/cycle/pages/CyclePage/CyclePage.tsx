import { useState } from 'react';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { useTopics } from '../../../topics/hooks/useTopics';
import { useCycle } from '../../hooks/useCycle';
import { CreateCycleModal } from '../../components/CreateCycleModal/CreateCycleModal';
import { ProgressCard } from '../../components/ProgressCard/ProgressCard';
import { ConfigCard } from '../../components/ConfigCard/ConfigCard';
import { CyclePanel } from '../../components/CyclePanel/CyclePanel';
import styles from './CyclePage.module.css';

export function CyclePage() {
    const { topics, loading } = useTopics();
    const {
        currentCycle,
        cycleSummary,
        config,
        isConfigModalOpen,
        updateConfig,
        addRule,
        removeRule,
        selectTopics,
        generateCycle,
        openConfigModal,
        closeConfigModal,
        currentStep,
        nextStep,
        prevStep,
        updateBlocks
    } = useCycle();

    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

    const hasProgress = Boolean(currentCycle?.blocks.some(b => b.completed));

    const handleReconfigureRequest = () => {
        if (currentCycle && hasProgress) {
            setShowDiscardConfirm(true);
        } else {
            openConfigModal();
        }
    };

    const handleConfirmDiscard = () => {
        setShowDiscardConfirm(false);
        openConfigModal();
    };

    const handleCancelDiscard = () => {
        setShowDiscardConfirm(false);
    };

    if (loading) {
        return <div className={styles.container}>
            <div className={styles.loading}>Carregando...</div>
        </div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Ciclo de Estudo
                </Text>
            </div>

            <div className={styles.twoColumnLayout}>
                <div className={styles.leftColumn}>
                    <ProgressCard
                        currentCycle={currentCycle}
                        summary={cycleSummary}
                    />

                    {currentCycle && (
                        <ConfigCard
                            cycle={currentCycle}
                            topics={topics}
                            onReconfigure={handleReconfigureRequest}
                        />
                    )}
                </div>

                <div className={styles.rightColumn}>
                    {currentCycle ? (
                        <CyclePanel
                            cycle={currentCycle}
                            onReconfigure={handleReconfigureRequest}
                            onSaveBlocks={updateBlocks}
                        />
                    ) : (
                        <div className={styles.emptyWidget}>
                            <div className={styles.emptyContent}>
                                <span className={`${styles.emptyIcon} material-icons`}>book</span>
                                <Text variant="body">
                                    Nenhum ciclo ativo
                                </Text>
                                <Button
                                    variant="primary"
                                    onClick={openConfigModal}
                                >
                                    Criar Primeiro Ciclo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateCycleModal
                isOpen={isConfigModalOpen}
                onClose={closeConfigModal}
                topics={topics}
                config={config}
                currentStep={currentStep}
                onNext={nextStep}
                onPrev={prevStep}
                onUpdateConfig={updateConfig}
                onAddRule={addRule}
                onRemoveRule={removeRule}
                onSelectTopics={selectTopics}
                onGenerate={generateCycle}
            />

            {showDiscardConfirm && (
                <div className={styles.confirmOverlay} onClick={handleCancelDiscard}>
                    <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.confirmTitle}>Reconfigurar ciclo em andamento?</h3>
                        <p className={styles.confirmText}>
                            Esse ciclo já tem blocos concluídos. Reconfigurar cria um ciclo
                            novo do zero e o progresso atual não poderá ser retomado.
                        </p>
                        <div className={styles.confirmButtons}>
                            <Button variant="ghost" onClick={handleCancelDiscard}>
                                Cancelar
                            </Button>
                            <button
                                className={styles.confirmDangerButton}
                                onClick={handleConfirmDiscard}
                            >
                                Descartar e começar do zero
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}