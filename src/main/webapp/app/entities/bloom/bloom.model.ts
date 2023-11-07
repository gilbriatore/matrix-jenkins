export interface IBloom {
  id: number;
  nivel?: string | null;
}

export type NewBloom = Omit<IBloom, 'id'> & { id: null };
