export interface IModalidade {
  id: number;
  nome?: string | null;
}

export type NewModalidade = Omit<IModalidade, 'id'> & { id: null };
