import { Text } from '@/shared/components/ui/Text/Text';
import { usePerformanceData } from '../../hooks/usePerformanceData';
import { MetricsGrid } from '../../components/MetricsGrid/MetricsGrid';
import { TimeBySubjectChart } from '../../components/TimeBySubjectChart/TimeBySubjectChart';
import { StudyEvolutionChart } from '../../components/StudyEvolutionChart/StudyEvolutionChart';
import { StudyHeatmap } from '../../components/StudyHeatmap/StudyHeatmap';
import { InsightsPanel } from '../../components/InsightsPanel/InsightsPanel';
import { CycleProgressCard } from '../../components/CycleProgressCard/CycleProgressCard';
import { CompletionRateCard } from '../../components/CompletionRateCard/CompletionRateCard';
import { AverageSessionCard } from '../../components/AverageSessionCard/AverageSessionCard';
import styles from './PerformancePage.module.css';

export function PerformancePage() {
    const { data, loading, error } = usePerformanceData();

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    if (error || !data) {
        return (
            <div className={styles.error}>
                <Text variant="body">Erro ao carregar dados</Text>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">
                    Desempenho
                </Text>
            </div>
            <p>Página em desenvolvimento!</p>
            {/* 
            <MetricsGrid metrics={data.metrics} />

            <div className={styles.twoColumnLayout}>

                <div className={styles.leftColumn}>

                    <TimeBySubjectChart data={data.subjectTime} />

                    <StudyEvolutionChart data={data.dailyEvolution} />

                    <StudyHeatmap data={data.heatmap} />
                </div>

                <div className={styles.rightColumn}>

                    <CycleProgressCard progress={data.cycleProgress} />

                    <CompletionRateCard stats={data.completionStats} />

                    <AverageSessionCard session={data.averageSession} />

                    <InsightsPanel insights={data.insights} />
                </div>
            </div> */}
        </div>
    );
}