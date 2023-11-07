import { IEscola, NewEscola } from './escola.model';

export const sampleWithRequiredData: IEscola = {
  id: 30042,
};

export const sampleWithPartialData: IEscola = {
  id: 23949,
  nome: 'bah pish',
};

export const sampleWithFullData: IEscola = {
  id: 10341,
  nome: 'macaroon nor grown',
};

export const sampleWithNewData: NewEscola = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
