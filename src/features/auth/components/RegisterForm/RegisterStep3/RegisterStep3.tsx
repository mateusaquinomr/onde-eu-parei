import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { authService } from '../../../services/auth.service';
import styles from './RegisterStep3.module.css';

interface Template {
    id: string;
    title: string;
    icon: string;
    description: string;
}

export function RegisterStep3() {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const templates: Template[] = [
        { id: 'enem', title: 'ENEM', icon: '1', description: 'Modelo com matérias padrão ENEM' },
        { id: 'concurso', title: 'Concurso', icon: '2', description: 'Modelo com matérias padrão concurso' },
        { id: 'faculdade', title: 'Faculdade', icon: '3', description: 'Modelo com matérias padrão faculdade' },
        { id: 'vazio', title: 'Vazio', icon: '4', description: 'Começar do zero' },
    ];

    useEffect(() => {
        const data = authService.getRegistrationData();
        if (!data.email || !data.password || !data.name || !data.username) {
            navigate('/register');
        }
    }, [navigate]);

    const completeRegistration = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = authService.getRegistrationData();

            if (!data.email || !data.password || !data.name || !data.username) {
                throw new Error('Dados incompletos');
            }

            const user = await authService.register({
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
            });

            console.log('Usuário registrado:', user);

            sessionStorage.clear();
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erro no registro:', err);
            setError(err.message || 'Erro ao completar cadastro');
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        completeRegistration();
    };

    const handleSelect = () => {
        if (selectedTemplate) {
            completeRegistration();
        }
    };

    const handleBack = () => {
        navigate('/register/info');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Text as="h2" variant="pageTitle" className={styles.title}>
                        Escolha um modelo
                    </Text>
                    <Text variant="body" className={styles.subtitle}>
                        Selecione um modelo ou pule para começar do zero
                    </Text>
                </div>

                {error && (
                    <div className={styles.errorBox}>
                        <Text variant="helper" className={styles.errorText}>
                            {error}
                        </Text>
                    </div>
                )}

                <div className={styles.templatesGrid}>
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''}`}
                            onClick={() => setSelectedTemplate(template.id)}
                            disabled={isLoading}
                        >
                            <span className={styles.templateIcon}>{template.icon}</span>
                            <Text variant="cardTitle" className={styles.templateTitle}>
                                {template.title}
                            </Text>
                            <Text variant="caption" className={styles.templateDescription}>
                                {template.description}
                            </Text>
                        </button>
                    ))}
                </div>

                <div className={styles.buttonGroup}>
                    <Button type="button" variant="secondary" onClick={handleBack} disabled={isLoading}>
                        Voltar
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleSkip} disabled={isLoading}>
                        {isLoading ? 'Cadastrando...' : 'Pular'}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleSelect}
                        disabled={!selectedTemplate || isLoading}
                    >
                        {isLoading ? 'Cadastrando...' : 'Selecionar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}