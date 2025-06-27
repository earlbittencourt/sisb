import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/config';
import { Programa } from '../types/programa';

export const useProgramas = () => {
    const [programas, setProgramas] = useState<Programa[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscarProgramas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/programas');
            setProgramas(response.data);
        } catch (err) {
            setError('Falha ao buscar programas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        buscarProgramas();
    }, [buscarProgramas]);

    return { programas, loading, error, buscarProgramas };
}; 