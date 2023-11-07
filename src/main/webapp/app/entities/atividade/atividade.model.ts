export interface IAtividade {
  id: number;
  nome?: string | null;
}

export type NewAtividade = Omit<IAtividade, 'id'> & { id: null };
