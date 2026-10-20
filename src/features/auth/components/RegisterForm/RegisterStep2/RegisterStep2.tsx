import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '@/shared/components/ui/Text/Text';
import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Form/Input';
import { authService } from '../../../services/auth.service';
import type { ValidationErrors } from '../../../types/auth.types';
import styles from './RegisterStep2.module.css';

export function RegisterStep2() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        const data = authService.getRegistrationData();
        if (!data.email || !data.password) {
            navigate('/register');
        }
    }, [navigate]);

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!name) newErrors.name = 'Nome é obrigatório';
        else if (name.length < 3) newErrors.name = 'Mínimo 3 caracteres';

        if (!username) newErrors.username = 'Usuário é obrigatório';
        else if (!/^[a-z0-9._]+$/.test(username)) {
            newErrors.username = 'Use letras minúsculas, números, . ou _';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        authService.saveStep2({ name, username });

        navigate('/register/template');
    };

    const handleBack = () => {
        navigate('/register');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Text as="h2" variant="pageTitle" className={styles.title}>
                        Quem é você?
                    </Text>

                    <Text variant="body" className={styles.subtitle}>
                        Como as pessoas vão te conhecer
                    </Text>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <Text variant="label">Nome completo</Text>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="João Silva"
                        />
                        {errors.name && (
                            <Text variant="helper" className={styles.errorText}>
                                {errors.name}
                            </Text>
                        )}
                    </div>

                    <div className={styles.field}>
                        <Text variant="label">Usuário (@)</Text>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                            placeholder="joaosilva"
                        />
                        {errors.username && (
                            <Text variant="helper" className={styles.errorText}>
                                {errors.username}
                            </Text>
                        )}
                        <Text variant="helper" className={styles.helper}>
                            Apenas letras minúsculas, números, ponto (.) e underline (_)
                        </Text>
                    </div>

                    <div className={styles.field}>
                        <Text variant="label">Foto de perfil</Text>
                        <div className={styles.avatarPlaceholder}>
                            {/* <span className={styles.avatarIcon}>📷</span> */}
                            <Text variant="caption" className={styles.avatarText}>
                                Em breve você poderá adicionar uma foto
                            </Text>
                        </div>
                    </div>

                    <div className={styles.buttonGroup}>
                        <Button type="button" variant="secondary" onClick={handleBack}>
                            Voltar
                        </Button>
                        <Button type="submit" variant="primary">
                            Continuar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}