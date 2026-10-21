import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { useEditais } from '../../hooks/useEditais';
import type { Edital } from '../../types/edital.types';
import styles from './NewEditalModal.module.css';

interface NewEditalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportClick: () => void;
    onEditalCreated?: () => void;
    editalParaEditar?: Edital | null;
}

function parseDateInputAsUTC(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

export function NewEditalModal({ isOpen, onClose, onImportClick, onEditalCreated, editalParaEditar }: NewEditalModalProps) {
    const { createEdital, updateEdital, editais } = useEditais();
    const [showManualForm, setShowManualForm] = useState(false);
    const [nome, setNome] = useState('');
    const [banca, setBanca] = useState('');
    const [dataProva, setDataProva] = useState('');
    const [local, setLocal] = useState('');

    const isEditMode = !!editalParaEditar;

    useEffect(() => {
        if (editalParaEditar) {
            setNome(editalParaEditar.nome);
            setBanca(editalParaEditar.banca);
            const dataFormatada = typeof editalParaEditar.dataProva === 'string'
                ? editalParaEditar.dataProva.split('T')[0]
                : new Date(editalParaEditar.dataProva).toISOString().split('T')[0];
            setDataProva(dataFormatada);
            setLocal(editalParaEditar.local);
            setShowManualForm(true);
        } else {
            setNome('');
            setBanca('');
            setDataProva('');
            setLocal('');
            setShowManualForm(false);
        }
    }, [editalParaEditar]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || !banca.trim() || !dataProva || !local.trim()) return;

        const nomeExistente = editais.some(
            e => e.nome.toLowerCase() === nome.trim().toLowerCase() && e.id !== editalParaEditar?.id
        );

        if (nomeExistente) {
            alert(`Já existe um edital com o nome "${nome.trim()}"`);
            return;
        }

        if (isEditMode && editalParaEditar) {
            await updateEdital(editalParaEditar.id, {
                nome: nome.trim(),
                banca: banca.trim(),
                dataProva: parseDateInputAsUTC(dataProva),
                local: local.trim()
            });
        } else {
            await createEdital({
                nome: nome.trim(),
                banca: banca.trim(),
                dataProva: parseDateInputAsUTC(dataProva),
                local: local.trim()
            });
        }

        setNome('');
        setBanca('');
        setDataProva('');
        setLocal('');
        setShowManualForm(false);
        onEditalCreated?.();
        onClose();
    };

    if (showManualForm) {
        return (
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{isEditMode ? 'Editar edital' : 'Adicionar edital manualmente'}</h2>
                        <button className={styles.closeButton} onClick={onClose}>
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label>Nome do edital *</label>
                            <Input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: TJSP"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Banca *</label>
                            <Input
                                value={banca}
                                onChange={(e) => setBanca(e.target.value)}
                                placeholder="Ex: Vunesp"
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Data da prova *</label>
                            <Input
                                type="date"
                                value={dataProva}
                                onChange={(e) => setDataProva(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Local *</label>
                            <Input
                                value={local}
                                onChange={(e) => setLocal(e.target.value)}
                                placeholder="Ex: São Paulo"
                                required
                            />
                        </div>

                        <div className={styles.footer}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => (isEditMode ? onClose() : setShowManualForm(false))}
                            >
                                <span className="material-icons">{isEditMode ? '' : 'arrow_back'}</span>
                                {isEditMode ? 'Cancelar' : 'Voltar'}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!nome.trim() || !banca.trim() || !dataProva || !local.trim()}
                            >
                                {/* <span className="material-icons">check</span> */}
                                {isEditMode ? 'Salvar alterações' : 'Criar edital'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Novo edital</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.options}>
                        <button
                            className={styles.optionCard}
                            onClick={onImportClick}
                        >
                            <span className={styles.optionIcon}>
                                <span className="material-icons">file_download</span>
                            </span>
                            <h3>Importar edital</h3>
                            <p>Importar de um template pronto</p>
                        </button>

                        <button
                            className={styles.optionCard}
                            onClick={() => setShowManualForm(true)}
                        >
                            <span className={styles.optionIcon}>
                                <span className="material-icons">edit_note</span>
                            </span>
                            <h3>Adicionar manualmente</h3>
                            <p>Criar edital do zero</p>
                        </button>
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}