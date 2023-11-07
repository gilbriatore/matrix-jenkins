export interface IUnidade {
  id: number;
  codigo?: string | null;
}

export type NewUnidade = Omit<IUnidade, 'id'> & { id: null };
