import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import styles from './HomePage.module.css';

export const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>

            <section className={styles.hero}>
                <div className={styles.heroContent}>

                    <Text as="h1" variant="pageTitle" className={styles.title}>
                        A quantida de conteúdos assusta.
                        <br />
                        <span className={styles.highlight}>A organização resolve.</span>
                    </Text>
                    <Text variant="body" className={styles.subtitle}>
                        <b>Versão demo</b> do projeto OndeEuParei, <br></br> plataforma que para gerenciar o estudo para concursos e ENEM. <br></br>
                        Você poderá importar editais com as matérias/tópicos e seus conteúdos,
                        <br></br>  configurar ciclos de estudo,
                        acompanhar o progresso e não  perder o ritmo de estudo.
                    </Text>
                    <div className={styles.buttons}>
                        <Button variant="primary" onClick={() => navigate('/register')}>
                            Começar agora
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/login')}>
                            Já tenho conta
                        </Button>
                    </div>
                </div>
            </section>

        </div>
    );
};