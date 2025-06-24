import { api } from './config';
import { PeriodoPrograma } from '../types/programa';

export async function listarPeriodosProgramas() {
  const response = await api.get<PeriodoPrograma[]>('/api/editais');
  return response.data;
}

export async function buscarPeriodoPrograma(id: number) {
  const response = await api.get<PeriodoPrograma>(`/api/editais/${id}`);
  return response.data;
}

export async function criarPeriodoPrograma(periodo: Omit<PeriodoPrograma, 'id'>) {
  const response = await api.post<PeriodoPrograma>('/api/editais', periodo);
  return response.data;
}

export async function atualizarPeriodoPrograma(id: number, periodo: Partial<PeriodoPrograma>) {
  const response = await api.patch<PeriodoPrograma>(`/api/editais/${id}`, periodo);
  return response.data;
}

export async function deletarPeriodoPrograma(id: number) {
  await api.delete(`/api/editais/${id}`);
}

export async function getPeriodosProgramas(filtros?: { tipo?: string, status?: string }): Promise<PeriodoPrograma[]> {
    const params = new URLSearchParams();
    if (filtros?.tipo && filtros.tipo !== 'all') {
        params.append('tipo', filtros.tipo);
    }
    if (filtros?.status && filtros.status !== 'all') {
        params.append('status', filtros.status);
    }
    const response = await api.get('/api/periodos-programas', { params });
    return response.data;
}

export async function deletePeriodoPrograma(id: number): Promise<void> {
    await api.delete(`/api/periodos-programas/${id}`);
}

export async function getProgramas() {
    const response = await api.get('/api/programas');
    return response.data;
}

export async function getStatus() {
    const response = await api.get('/api/status');
    return response.data;
}

export const getPeriodoProgramaById = async (id: number): Promise<PeriodoPrograma> => {
    const { data } = await api.get(`/api/periodos-programas/${id}`);
    return data;
};

export const updatePeriodoPrograma = async (id: number, periodo: Partial<PeriodoPrograma>): Promise<PeriodoPrograma> => {
    const { data } = await api.put(`/api/periodos-programas/${id}`, periodo);
    return data;
}; 