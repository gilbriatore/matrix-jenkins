import { IUnidade, NewUnidade } from './unidade.model';

export const sampleWithRequiredData: IUnidade = {
  id: 13193,
};

export const sampleWithPartialData: IUnidade = {
  id: 12346,
  codigo: 'barring because',
};

export const sampleWithFullData: IUnidade = {
  id: 13865,
  codigo: 'quicker ugh ah',
};

export const sampleWithNewData: NewUnidade = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
