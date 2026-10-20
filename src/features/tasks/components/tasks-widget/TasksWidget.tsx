import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useEditais } from '@/features/editais/hooks/useEditais';
import type { Task } from '../../types/task.types';
import styles from './TasksWidget.module.css';

function parseDateInputAsUTC(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function formatDateUTC(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'UTC'
    });
}

function isOverdue(dueDate?: string, completed?: boolean): boolean {
    if (!dueDate || completed) return false;
    const today = new Date();
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const dueUTC = new Date(dueDate).getTime();
    return dueUTC < todayUTC;
}

export function TasksWidget() {
    const { tasks, loading, createTask, toggleTask, deleteTask } = useTasks();
    const { editais } = useEditais();
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [editalId, setEditalId] = useState('');

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setEditalId('');
        setShowForm(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        await createTask({
            title: title.trim(),
            description: description.trim() || undefined,
            dueDate: dueDate ? parseDateInputAsUTC(dueDate) : undefined,
            editalId: editalId || undefined
        });
        resetForm();
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const getEditalNome = (id?: string) => {
        if (!id) return null;
        return editais.find(e => e.id === id)?.nome || null;
    };

    if (loading) {
        return <div className={styles.loading}>Carregando tarefas...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Tarefas</h3>
                <button
                    className={styles.addButton}
                    onClick={() => setShowForm(prev => !prev)}
                    title="Nova tarefa"
                >
                    <span className="material-icons">{showForm ? 'close' : 'add'}</span>
                </button>
            </div>

            {showForm && (
                <form className={styles.form} onSubmit={handleCreate}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="O que você precisa fazer?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className={styles.textarea}
                        placeholder="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                    />

                    {editais.length > 0 && (
                        <select
                            className={styles.editalSelect}
                            value={editalId}
                            onChange={(e) => setEditalId(e.target.value)}
                        >
                            <option value="">Sem edital vinculado</option>
                            {editais.map(edital => (
                                <option key={edital.id} value={edital.id}>
                                    {edital.nome}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className={styles.formFooter}>
                        <input
                            className={styles.dateInput}
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={!title.trim()}
                        >
                            Criar
                        </button>
                    </div>
                </form>
            )}

            {sortedTasks.length === 0 && !showForm ? (
                <div className={styles.emptyState}>
                    <span className="material-icons">checklist</span>
                    <p>Nenhuma tarefa ainda</p>
                </div>
            ) : (
                <ul className={styles.list}>
                    {sortedTasks.map((task: Task) => {
                        const overdue = isOverdue(task.dueDate, task.completed);
                        const editalNome = getEditalNome(task.editalId);
                        return (
                            <li
                                key={task.id}
                                className={`${styles.item} ${task.completed ? styles.completedItem : ''} ${overdue ? styles.overdueItem : ''}`}
                            >
                                <button
                                    className={styles.checkbox}
                                    onClick={() => toggleTask(task.id)}
                                    aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                                >
                                    {task.completed && <span className="material-icons">check</span>}
                                </button>

                                <div className={styles.itemContent}>
                                    <span className={styles.itemTitle}>{task.title}</span>
                                    {task.description && (
                                        <span className={styles.itemDescription}>{task.description}</span>
                                    )}
                                    {editalNome && (
                                        <span className={styles.editalBadge}>
                                            <span className="material-icons">folder</span>
                                            {editalNome}
                                        </span>
                                    )}
                                </div>

                                {task.dueDate && (
                                    <span className={`${styles.dateBadge} ${overdue ? styles.overdueBadge : ''}`}>
                                        {overdue && <span className="material-icons">warning</span>}
                                        {formatDateUTC(task.dueDate)}
                                    </span>
                                )}

                                <button
                                    className={styles.deleteButton}
                                    onClick={() => deleteTask(task.id)}
                                    aria-label="Excluir tarefa"
                                >
                                    <span className="material-icons">close</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}