import { useState } from 'react';
import { useStudyTimer } from '../../hooks/useStudyTimer';
import type { TimerProps } from '../../types/study.types';
import styles from './Timer.module.css';

export function Timer({
    sessionKey,
    topicId,
    contentId,
    topicName,
    contentTitle,
    estimatedTime,
    onTimeUpdate,
    onMinuteTick,
    onFinishContent,
    onCompleteBlock,
    className = ''
}: TimerProps) {
    const {
        isRunning,
        elapsedSeconds,
        hasReachedTarget,
        hasTarget,
        progress,
        estimatedSeconds,
        formattedTime,
        formattedEstimated,
        start,
        pause,
        finishBlock,
        reset
    } = useStudyTimer({
        sessionKey,
        estimatedTime,
        onTimeUpdate,
        onMinuteTick
    });

    const [showBlockChoice, setShowBlockChoice] = useState(false);
    const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);

    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = hasTarget
        ? circumference - (progress / 100) * circumference
        : circumference;

    const handleTogglePlayPause = () => {
        if (isRunning) {
            const finalElapsed = pause();
            if (hasTarget && finalElapsed >= estimatedSeconds) {
                setShowBlockChoice(true);
            }
        } else {
            start();
        }
    };

    const handleCompleteBlock = () => {
        const finalElapsed = finishBlock();
        setShowBlockChoice(false);
        onCompleteBlock?.(sessionKey, finalElapsed);
    };

    const handleContinueStudying = () => {
        setShowBlockChoice(false);
        start();
    };

    const handleFinishConfirm = (confirmed: boolean) => {
        setShowFinishConfirmation(false);
        if (confirmed) {
            onFinishContent?.(contentId, elapsedSeconds);
        }
    };

    const showingModal = showBlockChoice || showFinishConfirmation;

    return (
        <div className={`${styles.container} ${className}`}>
            <div className={styles.header}>
                <div className={styles.headerText}>
                    <h3 className={styles.topicName}>{topicName}</h3>
                    <p className={styles.contentTitle}>{contentTitle}</p>
                </div>

                {!showingModal && onFinishContent && (
                    <button
                        className={styles.finishIconButton}
                        onClick={() => setShowFinishConfirmation(true)}
                        title="Concluir este conteúdo agora"
                    >
                        <span className="material-icons">task_alt</span>
                    </button>
                )}
            </div>

            {showBlockChoice ? (
                <div className={styles.confirmationContainer}>
                    <p className={styles.confirmationText}>
                        O tempo planejado deste bloco ({formattedEstimated}) foi concluído.
                        O que você quer fazer?
                    </p>
                    <div className={styles.confirmationButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.confirmYesButton}`}
                            onClick={handleCompleteBlock}
                        >
                            <span className="material-icons">check_circle</span>
                            Concluir bloco
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.confirmNoButton}`}
                            onClick={handleContinueStudying}
                        >
                            <span className="material-icons">play_circle</span>
                            Continuar estudando
                        </button>
                    </div>
                </div>
            ) : showFinishConfirmation ? (
                <div className={styles.confirmationContainer}>
                    <p className={styles.confirmationText}>
                        Concluir "{contentTitle}" agora? O bloco continua rodando normalmente
                        com o próximo conteúdo — o tempo restante não é afetado.
                    </p>
                    <div className={styles.confirmationButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.confirmYesButton}`}
                            onClick={() => handleFinishConfirm(true)}
                        >
                            <span className="material-icons">check</span>
                            Sim, concluir
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.confirmNoButton}`}
                            onClick={() => handleFinishConfirm(false)}
                        >
                            <span className="material-icons">close</span>
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.mainContent}>
                    {hasReachedTarget && (
                        <span className={styles.reachedTargetBadge}>
                            <span className="material-icons">check_circle</span>
                            Tempo planejado concluído - continuando
                        </span>
                    )}

                    <div className={styles.timerWrapper}>
                        <svg
                            className={styles.progressRing}
                            viewBox="0 0 200 200"
                            width="180"
                            height="180"
                        >
                            <circle
                                className={styles.backgroundRing}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                            />
                            <circle
                                className={`${styles.progressRingFill} ${hasReachedTarget ? styles.progressRingOvertime : ''}`}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                                style={{
                                    transition: 'stroke-dashoffset 0.3s ease'
                                }}
                            />
                            <g className={styles.textGroup}>
                                <text
                                    className={styles.currentTimeText}
                                    x="100"
                                    y="90"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedTime}
                                </text>
                                <text
                                    className={styles.estimatedTimeText}
                                    x="100"
                                    y="118"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {formattedEstimated}
                                </text>
                            </g>
                        </svg>
                    </div>

                    <div className={styles.controlsRow}>
                        <button
                            className={styles.controlIconButton}
                            onClick={handleTogglePlayPause}
                            title={isRunning ? 'Pausar' : 'Iniciar'}
                        >
                            <span className="material-icons">{isRunning ? 'pause' : 'play_arrow'}</span>
                        </button>

                        <button
                            className={`${styles.controlIconButton} ${styles.resetIconButton} ${elapsedSeconds === 0 ? styles.disabled : ''}`}
                            onClick={reset}
                            disabled={elapsedSeconds === 0}
                            title="Reiniciar"
                        >
                            <span className="material-icons">refresh</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}