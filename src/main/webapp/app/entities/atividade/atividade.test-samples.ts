import { IAtividade, NewAtividade } from './atividade.model';

export const sampleWithRequiredData: IAtividade = {
  id: 27467,
};

export const sampleWithPartialData: IAtividade = {
  id: 16854,
  nome: 'ick even table',
};

export const sampleWithFullData: IAtividade = {
  id: 30348,
  nome: 'evenly pushy excuse',
};

export const sampleWithNewData: NewAtividade = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
