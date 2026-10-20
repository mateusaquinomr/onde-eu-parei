import { useState } from 'react';
import type { Edital } from '../../types/edital.types';
import styles from './EditalHeader.module.css';

interface EditalHeaderProps {
    edital: Edital;
    onEdit?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
}

export function EditalHeader({ edital, onEdit, onArchive, onDelete }: EditalHeaderProps) {
    const [showMenu, setShowMenu] = useState(false);

    const mesesRestantes = (data: Date | string): string => {
        const hoje = new Date();

        const dataProva = typeof data === 'string' ? new Date(data) : data;

        if (!(dataProva instanceof Date) || isNaN(dataProva.getTime())) {
            return 'Data inválida';
        }

        const diff = dataProva.getTime() - hoje.getTime();
        const meses = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
        if (meses < 0) return 'Prova já passou';
        if (meses === 0) return 'Este mês!';
        return `${meses} meses para a prova`;
    };

    const formatarData = (data: Date | string): string => {
        const dataProva = typeof data === 'string' ? new Date(data) : data;

        if (!(dataProva instanceof Date) || isNaN(dataProva.getTime())) {
            return 'Data inválida';
        }

        return dataProva.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    return (
        <div className={styles.header}>
            <div className={styles.info}>
                <h2 className={styles.name}>{edital.nome}</h2>
                <div className={styles.metadata}>
                    <span className={styles.metadataItem}>
                        <span className="material-icons">business</span>
                        {edital.banca}
                    </span>
                    <span className={styles.metadataItem}>
                        <span className="material-icons">event</span>
                        {formatarData(edital.dataProva)}
                    </span>
                    <span className={styles.metadataItem}>
                        <span className="material-icons">location_on</span>
                        {edital.local}
                    </span>
                    <span className={`${styles.metadataItem} ${styles.days}`}>
                        <span className="material-icons">schedule</span>
                        {mesesRestantes(edital.dataProva)}
                    </span>
                </div>
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
                        {onEdit && (
                            <button
                                className={styles.menuItem}
                                onClick={() => {
                                    setShowMenu(false);
                                    onEdit();
                                }}
                            >
                                <span className="material-icons">edit</span>
                                Editar edital
                            </button>
                        )}
                        {onArchive && (
                            <button
                                className={styles.menuItem}
                                onClick={() => {
                                    setShowMenu(false);
                                    onArchive();
                                }}
                            >
                                <span className="material-icons">archive</span>
                                Arquivar
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className={`${styles.menuItem} ${styles.deleteItem}`}
                                onClick={() => {
                                    setShowMenu(false);
                                    onDelete();
                                }}
                            >
                                <span className="material-icons">delete</span>
                                Excluir edital
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}