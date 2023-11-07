import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../escola.test-samples';

import { EscolaFormService } from './escola-form.service';

describe('Escola Form Service', () => {
  let service: EscolaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscolaFormService);
  });

  describe('Service methods', () => {
    describe('createEscolaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEscolaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing IEscola should create a new form with FormGroup', () => {
        const formGroup = service.createEscolaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getEscola', () => {
      it('should return NewEscola for default Escola initial value', () => {
        const formGroup = service.createEscolaFormGroup(sampleWithNewData);

        const escola = service.getEscola(formGroup) as any;

        expect(escola).toMatchObject(sampleWithNewData);
      });

      it('should return NewEscola for empty Escola initial value', () => {
        const formGroup = service.createEscolaFormGroup();

        const escola = service.getEscola(formGroup) as any;

        expect(escola).toMatchObject({});
      });

      it('should return IEscola', () => {
        const formGroup = service.createEscolaFormGroup(sampleWithRequiredData);

        const escola = service.getEscola(formGroup) as any;

        expect(escola).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEscola should not enable id FormControl', () => {
        const formGroup = service.createEscolaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEscola should disable id FormControl', () => {
        const formGroup = service.createEscolaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
