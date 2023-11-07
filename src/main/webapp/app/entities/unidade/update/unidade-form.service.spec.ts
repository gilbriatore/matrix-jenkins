import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../unidade.test-samples';

import { UnidadeFormService } from './unidade-form.service';

describe('Unidade Form Service', () => {
  let service: UnidadeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadeFormService);
  });

  describe('Service methods', () => {
    describe('createUnidadeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUnidadeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });

      it('passing IUnidade should create a new form with FormGroup', () => {
        const formGroup = service.createUnidadeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
          }),
        );
      });
    });

    describe('getUnidade', () => {
      it('should return NewUnidade for default Unidade initial value', () => {
        const formGroup = service.createUnidadeFormGroup(sampleWithNewData);

        const unidade = service.getUnidade(formGroup) as any;

        expect(unidade).toMatchObject(sampleWithNewData);
      });

      it('should return NewUnidade for empty Unidade initial value', () => {
        const formGroup = service.createUnidadeFormGroup();

        const unidade = service.getUnidade(formGroup) as any;

        expect(unidade).toMatchObject({});
      });

      it('should return IUnidade', () => {
        const formGroup = service.createUnidadeFormGroup(sampleWithRequiredData);

        const unidade = service.getUnidade(formGroup) as any;

        expect(unidade).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUnidade should not enable id FormControl', () => {
        const formGroup = service.createUnidadeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUnidade should disable id FormControl', () => {
        const formGroup = service.createUnidadeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
