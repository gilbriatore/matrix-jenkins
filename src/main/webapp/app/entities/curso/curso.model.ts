import { IEscola } from 'app/entities/escola/escola.model';
import { ITipoDeCurso } from 'app/entities/tipo-de-curso/tipo-de-curso.model';

export interface ICurso {
  id: number;
  nome?: string | null;
  cargaHorasMinCurso?: number | null;
  cargaHorasMinEstagio?: number | null;
  percMaxEstagioAC?: number | null;
  percMaxAtividadeDistancia?: number | null;
  escola?: Pick<IEscola, 'id'> | null;
  tipo?: Pick<ITipoDeCurso, 'id'> | null;
}

export type NewCurso = Omit<ICurso, 'id'> & { id: null };
