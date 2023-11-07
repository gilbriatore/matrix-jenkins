import { ICurso, NewCurso } from './curso.model';

export const sampleWithRequiredData: ICurso = {
  id: 20810,
};

export const sampleWithPartialData: ICurso = {
  id: 18605,
  cargaHorasMinEstagio: 26975,
};

export const sampleWithFullData: ICurso = {
  id: 6339,
  nome: 'wasteful testy',
  cargaHorasMinCurso: 5870,
  cargaHorasMinEstagio: 29822,
  percMaxEstagioAC: 2569,
  percMaxAtividadeDistancia: 19979,
};

export const sampleWithNewData: NewCurso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
