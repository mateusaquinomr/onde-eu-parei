import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import type { Cycle } from '../../types/cycle.types';
import type { Topic } from '../../../topics/types/topic.types';
import styles from './ConfigCard.module.css';

interface ConfigCardProps {
    cycle: Cycle;
    topics: Topic[];
    onReconfigure: () => void;
}

export function ConfigCard({ cycle, topics, onReconfigure }: ConfigCardProps) {
    const getTopicName = (topicId: string): string => {
        const topic = topics.find(t => t.id === topicId);
        return topic?.name || topicId;
    };

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return 'N/A';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return 'Data inválida';
            return dateObj.toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Text variant="cardTitle" className={styles.title}>
                    Preferências do Ciclo
                </Text>
                <Button
                    variant="ghost"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#696868" radius="25px"><path d="M520-330v-60h160v60H520Zm60 210v-50h-60v-60h60v-50h60v160h-60Zm100-50v-60h160v60H680Zm40-110v-160h60v50h60v60h-60v50h-60Zm111-280h-83q-26-88-99-144t-169-56q-117 0-198.5 81.5T200-480q0 72 32.5 132t87.5 98v-110h80v240H160v-80h94q-62-50-98-122.5T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q129 0 226.5 79.5T831-560Z" /></svg>}
                    onClick={onReconfigure}
                    className={styles.reconfigureButton}
                    aria-label="Reconfigurar ciclo"
                />
            </div>

            <div className={styles.dates}>
                <Text variant="caption" className={styles.dateItem}>
                    Criação: {formatDate(cycle.createdAt)}
                </Text>
                <Text variant="caption" className={styles.dateItem}>
                    Atualização: {formatDate(cycle.updatedAt)}
                </Text>
            </div>

            <div className={styles.section}>
                <Text variant="label">Horários</Text>
                <div className={styles.hoursRow}>
                    <div className={styles.hourItem}>
                        <Text variant="caption">Máximo</Text>
                        <Text variant="body" className={styles.hourValue}>
                            {cycle.config.minutesPerTopic}min
                        </Text>
                    </div>
                    <div className={styles.hourDivider}>→</div>
                    <div className={styles.hourItem}>
                        <Text variant="caption">Mínimo</Text>
                        <Text variant="body" className={styles.hourValue}>
                            {cycle.config.minMinutesPerTopic}min
                        </Text>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <Text variant="label">Tópicos ({cycle.config.selectedTopics.length})</Text>
                <div className={styles.topicsList}>
                    {cycle.config.selectedTopics.map((topicId, index) => (
                        <div key={topicId} className={styles.topicItem}>
                            <span className={styles.topicNumber}>{index + 1}.</span>
                            <span className={styles.topicName}>{getTopicName(topicId)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {cycle.config.rules.length > 0 && (
                <div className={styles.section}>
                    <Text variant="label">Regras</Text>
                    <div className={styles.rulesList}>
                        {cycle.config.rules.map(rule => (
                            <div key={rule.id} className={styles.ruleItem}>
                                <span className={styles.ruleText}>
                                    {getTopicName(rule.topic1)} {rule.logicalOperator} {rule.timeRelation} {getTopicName(rule.topic2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}