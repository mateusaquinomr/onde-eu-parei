import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { Select } from '@/shared/components/ui/Form/Select';
import type { Topic } from '../../../topics/types/topic.types';
import type { CycleRule, LogicalOperator, TimeRelation } from '../../types/cycle.types';
import styles from './AddRule.module.css';

const logicalOperatorOptions: { label: string; value: LogicalOperator }[] = [
    { label: 'deve estar', value: 'deve estar' },
    { label: 'não deve estar', value: 'não deve estar' }
];

const timeRelationOptions: { label: string; value: TimeRelation }[] = [
    { label: 'antes de', value: 'antes' },
    { label: 'depois de', value: 'depois' }
    // { label: 'entre', value: 'entre' }
];

interface AddRuleProps {
    topics: Topic[];
    onAdd: (rule: Omit<CycleRule, 'id'>) => void;
}

export function AddRule({ topics, onAdd }: AddRuleProps) {
    const [topic1, setTopic1] = useState('');
    const [logicalOperator, setLogicalOperator] = useState<LogicalOperator>('deve estar');
    const [timeRelation, setTimeRelation] = useState<TimeRelation>('antes');
    const [topic2, setTopic2] = useState('');

    const topicOptions = [
        { label: 'Selecione um tópico', value: '' },
        ...topics.map(t => ({ label: t.name, value: t.id }))
    ];

    const handleAdd = () => {
        if (!topic1 || !topic2) return;

        onAdd({
            topic1,
            logicalOperator,
            timeRelation,
            topic2
        });

        setTopic1('');
        setLogicalOperator('deve estar');
        setTimeRelation('antes');
        setTopic2('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.field}>
                    <Select
                        value={topic1}
                        onChange={(val) => setTopic1(val)}
                        options={topicOptions}
                    />
                </div>

                <div className={styles.operator}>
                    <Select
                        value={logicalOperator}
                        onChange={(val) => setLogicalOperator(val as LogicalOperator)}
                        options={logicalOperatorOptions}
                    />
                </div>

                <div className={styles.relation}>
                    <Select
                        value={timeRelation}
                        onChange={(val) => setTimeRelation(val as TimeRelation)}
                        options={timeRelationOptions}
                    />
                </div>

                <div className={styles.field}>
                    <Select
                        value={topic2}
                        onChange={(val) => setTopic2(val)}
                        options={topicOptions}
                    />
                </div>

                <div className={styles.buttonWrapper}>
                    <Button
                        variant="primary"
                        onClick={handleAdd}
                        disabled={!topic1 || !topic2}
                    >
                        Adicionar
                    </Button>
                </div>
            </div>
        </div>
    );
}