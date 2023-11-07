import { ITipoDeCurso, NewTipoDeCurso } from './tipo-de-curso.model';

export const sampleWithRequiredData: ITipoDeCurso = {
  id: 8270,
};

export const sampleWithPartialData: ITipoDeCurso = {
  id: 26156,
};

export const sampleWithFullData: ITipoDeCurso = {
  id: 7157,
  nome: 'usually suspicious pro',
};

export const sampleWithNewData: NewTipoDeCurso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
