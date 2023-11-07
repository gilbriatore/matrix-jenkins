import { IBloom, NewBloom } from './bloom.model';

export const sampleWithRequiredData: IBloom = {
  id: 2560,
};

export const sampleWithPartialData: IBloom = {
  id: 17356,
};

export const sampleWithFullData: IBloom = {
  id: 23468,
  nivel: 'supplant',
};

export const sampleWithNewData: NewBloom = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
