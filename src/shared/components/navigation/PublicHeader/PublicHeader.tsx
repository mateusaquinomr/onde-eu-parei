import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button/Button';
import { Text } from '@/shared/components/ui/Text/Text';
import styles from './PublicHeader.module.css';

export const PublicHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}></span>
                    <Text variant="cardTitle" className={styles.logoText}>
                        OndeEuParei
                    </Text>
                </Link>

                <div className={styles.actions}>
                    <Link to="/login" className={styles.entrar}>
                        <Button >Entrar</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary">Cadastrar</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};