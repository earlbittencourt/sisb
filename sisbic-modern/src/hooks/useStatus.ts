import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/config';
import { Status } from '../types/status';

export const useStatus = () => {
    const [status, setStatus] = useState<Status[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarStatus = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/status');
            setStatus(response.data);
        } catch (err) {
            setError('Falha ao buscar status');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Carregar status automaticamente quando o hook é inicializado
    useEffect(() => {
        buscarStatus();
    }, [buscarStatus]);

    return { status, loading, error, buscarStatus };
}; 