export interface IMatriz {
  id: number;
  codigo?: string | null;
}

export type NewMatriz = Omit<IMatriz, 'id'> & { id: null };
