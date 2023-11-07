import { IModalidade, NewModalidade } from './modalidade.model';

export const sampleWithRequiredData: IModalidade = {
  id: 642,
};

export const sampleWithPartialData: IModalidade = {
  id: 12102,
  nome: 'on times',
};

export const sampleWithFullData: IModalidade = {
  id: 18901,
  nome: 'captor',
};

export const sampleWithNewData: NewModalidade = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
