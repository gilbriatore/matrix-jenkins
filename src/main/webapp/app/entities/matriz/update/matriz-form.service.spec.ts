import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../matriz.test-samples';

import { MatrizFormService } from './matriz-form.service';

describe('Matriz Form Service', () => {
  let service: MatrizFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrizFormService);
  });

  describe('Service methods', () => {
    describe('createMatrizFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMatrizFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });

      it('passing IMatriz should create a new form with FormGroup', () => {
        const formGroup = service.createMatrizFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });
    });

    describe('getMatriz', () => {
      it('should return NewMatriz for default Matriz initial value', () => {
        const formGroup = service.createMatrizFormGroup(sampleWithNewData);

        const matriz = service.getMatriz(formGroup) as any;

        expect(matriz).toMatchObject(sampleWithNewData);
      });

      it('should return NewMatriz for empty Matriz initial value', () => {
        const formGroup = service.createMatrizFormGroup();

        const matriz = service.getMatriz(formGroup) as any;

        expect(matriz).toMatchObject({});
      });

      it('should return IMatriz', () => {
        const formGroup = service.createMatrizFormGroup(sampleWithRequiredData);

        const matriz = service.getMatriz(formGroup) as any;

        expect(matriz).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMatriz should not enable id FormControl', () => {
        const formGroup = service.createMatrizFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMatriz should disable id FormControl', () => {
        const formGroup = service.createMatrizFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
