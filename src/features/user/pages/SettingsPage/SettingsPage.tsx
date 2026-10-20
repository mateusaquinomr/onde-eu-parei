import { Text } from '@/shared/components/ui/Text/Text';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text as="h1" variant="pageTitle">Configurações</Text>
            </div>
            <p>Página em desenvolvimento!</p>
        </div>
    );
}