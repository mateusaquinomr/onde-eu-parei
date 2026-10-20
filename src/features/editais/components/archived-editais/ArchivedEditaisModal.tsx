import type { Edital } from '../../types/edital.types';
import styles from './ArchivedEditaisModal.module.css';

interface ArchivedEditaisModalProps {
    isOpen: boolean;
    onClose: () => void;
    archivedEditais: Edital[];
    onUnarchive: (edital: Edital) => void;
    onOpen: (edital: Edital) => void;
}

const formatarData = (data: Date | string): string => {
    const dataProva = typeof data === 'string' ? new Date(data) : data;
    if (!(dataProva instanceof Date) || isNaN(dataProva.getTime())) return 'Data inválida';
    return dataProva.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
    });
};

export function ArchivedEditaisModal({
    isOpen,
    onClose,
    archivedEditais,
    onUnarchive,
    onOpen
}: ArchivedEditaisModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Editais arquivados</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    {archivedEditais.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className="material-icons">inventory_2</span>
                            <p>Nenhum edital arquivado</p>
                        </div>
                    ) : (
                        <ul className={styles.list}>
                            {archivedEditais.map(edital => (
                                <li key={edital.id} className={styles.item}>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{edital.nome}</span>
                                        <span className={styles.itemMeta}>
                                            {edital.banca} · {formatarData(edital.dataProva)}
                                        </span>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <button
                                            className={styles.openButton}
                                            onClick={() => onOpen(edital)}
                                        >
                                            Abrir
                                        </button>
                                        <button
                                            className={styles.unarchiveButton}
                                            onClick={() => onUnarchive(edital)}
                                            title="Desarquivar"
                                        >
                                            <span className="material-icons">unarchive</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}