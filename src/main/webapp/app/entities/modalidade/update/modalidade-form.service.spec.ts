import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../modalidade.test-samples';

import { ModalidadeFormService } from './modalidade-form.service';

describe('Modalidade Form Service', () => {
  let service: ModalidadeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalidadeFormService);
  });

  describe('Service methods', () => {
    describe('createModalidadeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createModalidadeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing IModalidade should create a new form with FormGroup', () => {
        const formGroup = service.createModalidadeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getModalidade', () => {
      it('should return NewModalidade for default Modalidade initial value', () => {
        const formGroup = service.createModalidadeFormGroup(sampleWithNewData);

        const modalidade = service.getModalidade(formGroup) as any;

        expect(modalidade).toMatchObject(sampleWithNewData);
      });

      it('should return NewModalidade for empty Modalidade initial value', () => {
        const formGroup = service.createModalidadeFormGroup();

        const modalidade = service.getModalidade(formGroup) as any;

        expect(modalidade).toMatchObject({});
      });

      it('should return IModalidade', () => {
        const formGroup = service.createModalidadeFormGroup(sampleWithRequiredData);

        const modalidade = service.getModalidade(formGroup) as any;

        expect(modalidade).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IModalidade should not enable id FormControl', () => {
        const formGroup = service.createModalidadeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewModalidade should disable id FormControl', () => {
        const formGroup = service.createModalidadeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
