export interface ITipoDeCurso {
  id: number;
  nome?: string | null;
}

export type NewTipoDeCurso = Omit<ITipoDeCurso, 'id'> & { id: null };
