import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tipo-de-curso.test-samples';

import { TipoDeCursoFormService } from './tipo-de-curso-form.service';

describe('TipoDeCurso Form Service', () => {
  let service: TipoDeCursoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDeCursoFormService);
  });

  describe('Service methods', () => {
    describe('createTipoDeCursoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTipoDeCursoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing ITipoDeCurso should create a new form with FormGroup', () => {
        const formGroup = service.createTipoDeCursoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getTipoDeCurso', () => {
      it('should return NewTipoDeCurso for default TipoDeCurso initial value', () => {
        const formGroup = service.createTipoDeCursoFormGroup(sampleWithNewData);

        const tipoDeCurso = service.getTipoDeCurso(formGroup) as any;

        expect(tipoDeCurso).toMatchObject(sampleWithNewData);
      });

      it('should return NewTipoDeCurso for empty TipoDeCurso initial value', () => {
        const formGroup = service.createTipoDeCursoFormGroup();

        const tipoDeCurso = service.getTipoDeCurso(formGroup) as any;

        expect(tipoDeCurso).toMatchObject({});
      });

      it('should return ITipoDeCurso', () => {
        const formGroup = service.createTipoDeCursoFormGroup(sampleWithRequiredData);

        const tipoDeCurso = service.getTipoDeCurso(formGroup) as any;

        expect(tipoDeCurso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITipoDeCurso should not enable id FormControl', () => {
        const formGroup = service.createTipoDeCursoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTipoDeCurso should disable id FormControl', () => {
        const formGroup = service.createTipoDeCursoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
