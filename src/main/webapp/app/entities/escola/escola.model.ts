export interface IEscola {
  id: number;
  nome?: string | null;
}

export type NewEscola = Omit<IEscola, 'id'> & { id: null };
