import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../atividade.test-samples';

import { AtividadeFormService } from './atividade-form.service';

describe('Atividade Form Service', () => {
  let service: AtividadeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtividadeFormService);
  });

  describe('Service methods', () => {
    describe('createAtividadeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAtividadeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing IAtividade should create a new form with FormGroup', () => {
        const formGroup = service.createAtividadeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getAtividade', () => {
      it('should return NewAtividade for default Atividade initial value', () => {
        const formGroup = service.createAtividadeFormGroup(sampleWithNewData);

        const atividade = service.getAtividade(formGroup) as any;

        expect(atividade).toMatchObject(sampleWithNewData);
      });

      it('should return NewAtividade for empty Atividade initial value', () => {
        const formGroup = service.createAtividadeFormGroup();

        const atividade = service.getAtividade(formGroup) as any;

        expect(atividade).toMatchObject({});
      });

      it('should return IAtividade', () => {
        const formGroup = service.createAtividadeFormGroup(sampleWithRequiredData);

        const atividade = service.getAtividade(formGroup) as any;

        expect(atividade).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAtividade should not enable id FormControl', () => {
        const formGroup = service.createAtividadeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAtividade should disable id FormControl', () => {
        const formGroup = service.createAtividadeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
