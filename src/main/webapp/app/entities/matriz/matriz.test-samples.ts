import { IMatriz, NewMatriz } from './matriz.model';

export const sampleWithRequiredData: IMatriz = {
  id: 6732,
};

export const sampleWithPartialData: IMatriz = {
  id: 15501,
  codigo: 'but',
};

export const sampleWithFullData: IMatriz = {
  id: 15927,
  codigo: 'fraternise energetically',
};

export const sampleWithNewData: NewMatriz = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
