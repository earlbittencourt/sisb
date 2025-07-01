export interface Status {
    PPS_Codigo: number;
    PPS_Descricao: string;
}

export enum CategoriaStatus {
    EM_INSCRICAO = 'emInscricao',
    EM_ANDAMENTO = 'emAndamento',
    OUTROS = 'outros'
}

// Mapeamento dos códigos de status para categorias
export const STATUS_CATEGORIA_MAP: Record<number, CategoriaStatus> = {
    4: CategoriaStatus.EM_INSCRICAO,  // em inscrições
    1: CategoriaStatus.EM_ANDAMENTO,  // em andamento
    2: CategoriaStatus.OUTROS,        // concluido
    3: CategoriaStatus.OUTROS,        // indisponível
    5: CategoriaStatus.OUTROS         // cancelado
};

export function categorizarStatus(statusId: number): CategoriaStatus {
    return STATUS_CATEGORIA_MAP[statusId] || CategoriaStatus.OUTROS;
} 