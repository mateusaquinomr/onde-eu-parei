import { useState, useEffect, useRef } from "react";

import styles from './Notes.module.css';

interface NotesInputProps {
    value: string;
    onChange: (value: string) => void;
    onSave: () => void;
    viewMode: 'default' | 'expanded';
    isEditing: boolean;
    onToggleExpand: () => void;
}

export function NotesInput({
    value,
    onChange,
    onSave,
    viewMode,
    isEditing,
    onToggleExpand
}: NotesInputProps) {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = 'auto';

            const newHeight = Math.min(textarea.scrollHeight, 120);

            textarea.style.height = `${newHeight}px`;
        }
    }, [content]);

    useEffect(() => {
        if (!value) {
            setTitle('');
            setContent('');
            return;
        }

        const strongMatch = value.match(/<strong>(.*?)<\/strong>/);

        if (strongMatch) {
            setTitle(strongMatch[1]);

            const rest = value
                .replace(/<strong>.*?<\/strong>/, '')
                .replace(/^<br>/, '');

            setContent(rest);
        } else {
            setTitle('');
            setContent(value);
        }
    }, [value]);

    function emitChange(newTitle: string, newContent: string) {
        if (!newTitle && !newContent) {
            onChange('');
            return;
        }

        let combined = '';

        if (newTitle) {
            combined += `<strong>${newTitle}</strong>`;
        }

        if (newContent) {
            if (newTitle) {
                combined += '<br>';
            }

            combined += newContent;
        }

        onChange(combined);
    }

    return (
        <div
            className={`${styles.notesInput} ${viewMode === 'expanded' ? styles.expanded : ''
                }`}
        >
            <div className={styles.notesInputHeader}>

                <button
                    className={styles.notesInputIconButton}
                    type="button"
                    title="Adicionar"
                >
                    <span className="material-icons">
                        add
                    </span>
                </button>

                <div className={styles.notesInputSpacer} />

                <div className={styles.notesInputActions}>

                    {!isEditing && (
                        <button
                            className={`${styles.notesInputIconButton} ${viewMode === 'expanded'
                                ? styles.active
                                : ''
                                }`}
                            onClick={onToggleExpand}
                            title={
                                viewMode === 'expanded'
                                    ? 'Recolher'
                                    : 'Expandir editor'
                            }
                            type="button"
                        >
                            <span className="material-symbols-outlined">
                                expand_content
                            </span>
                        </button>
                    )}

                    <button
                        className={styles.notesInputIconButton}
                        onClick={onSave}
                        title={
                            isEditing
                                ? 'Salvar alterações'
                                : 'Salvar anotação'
                        }
                        type="button"
                    >
                        <span className="material-icons">
                            {
                                isEditing
                                    ? 'check'
                                    : 'arrow_upward'
                            }
                        </span>
                    </button>

                </div>
            </div>

            <div className={styles.notesInputFields}>

                <input
                    type="text"
                    className={styles.notesInputTitle}
                    placeholder="Título"
                    value={title}
                    onChange={(e) => {
                        const newTitle = e.target.value;

                        setTitle(newTitle);

                        emitChange(
                            newTitle,
                            content
                        );
                    }}
                />

                <textarea
                    ref={textareaRef}
                    className={styles.notesInputContent}
                    placeholder="Escreva suas anotações..."
                    value={content}
                    onChange={(e) => {
                        const newContent = e.target.value;

                        setContent(newContent);

                        emitChange(
                            title,
                            newContent
                        );
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                            e.preventDefault();

                            onSave();
                        }
                    }}
                    rows={2}
                />

            </div>
        </div>
    );
}