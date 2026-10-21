import { useState, useRef, useEffect } from 'react';
import { Text } from '../Text/Text';
import { Select } from '../Form/Select';
import { Input } from '../Form/Input';
import styles from './EditableMetadata.module.css';

export interface MetadataField {
    id: string;
    label: string;
    value: any;
    type: 'text' | 'select' | 'color';
    options?: Array<{ label: string; value: any; color?: string }>;
    placeholder?: string;
}

interface EditableMetadataProps {
    fields: MetadataField[];
    onSave: (fieldId: string, newValue: any) => void;
    className?: string;
}

export function EditableMetadata({
    fields,
    onSave,
    className
}: EditableMetadataProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Record<string, any>>(
        fields.reduce((acc, field) => ({ ...acc, [field.id]: field.value }), {})
    );
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setEditingField(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleStartEdit = (fieldId: string) => {
        setEditingField(fieldId);
        setEditValues(prev => ({ ...prev, [fieldId]: fields.find(f => f.id === fieldId)?.value }));
    };

    const handleSave = (fieldId: string) => {
        onSave(fieldId, editValues[fieldId]);
        setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, fieldId: string) => {
        if (e.key === 'Enter') {
            handleSave(fieldId);
        } else if (e.key === 'Escape') {
            setEditingField(null);
        }
    };

    const renderField = (field: MetadataField) => {
        const isEditing = editingField === field.id;

        if (isEditing) {
            switch (field.type) {
                case 'select':
                    return (
                        <Select
                            value={editValues[field.id]}
                            onChange={(value) => {
                                setEditValues(prev => ({ ...prev, [field.id]: value }));

                                onSave(field.id, value);
                                setEditingField(null);
                            }}
                            options={field.options || []}
                        />
                    );
                case 'text':
                default:
                    return (
                        <Input
                            value={editValues[field.id]}
                            onChange={(e) => setEditValues(prev => ({ ...prev, [field.id]: e.target.value }))}
                            onBlur={() => handleSave(field.id)}
                            onKeyDown={(e) => handleKeyDown(e, field.id)}
                            placeholder={field.placeholder}

                        />
                    );
            }
        }


        if (field.type === 'select' && field.options) {
            const option = field.options.find(opt => opt.value === field.value);
            const displayValue = option?.label || field.value;

            return (
                <div
                    className={styles.valueContainer}
                    onClick={() => handleStartEdit(field.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleStartEdit(field.id);
                        }
                    }}
                >
                    {option?.color && (
                        <span
                            className={styles.colorDot}
                            style={{ backgroundColor: option.color }}
                        />
                    )}
                    <Text className={styles.editableValue}>
                        {displayValue}
                    </Text>
                    <span className={styles.editIcon}>!</span>
                </div>
            );
        }

        return (
            <div
                className={styles.valueContainer}
                onClick={() => handleStartEdit(field.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleStartEdit(field.id);
                    }
                }}
            >
                <Text className={styles.editableValue}>
                    {field.value}
                </Text>
                <span className={styles.editIcon}>!</span>
            </div>
        );
    };

    return (
        <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
            {fields.map(field => (
                <div key={field.id} className={styles.field}>
                    <Text variant="label" className={styles.label}>
                        {field.label}
                    </Text>
                    {renderField(field)}
                </div>
            ))}
        </div>
    );
}