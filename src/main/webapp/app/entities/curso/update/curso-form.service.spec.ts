import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../curso.test-samples';

import { CursoFormService } from './curso-form.service';

describe('Curso Form Service', () => {
  let service: CursoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursoFormService);
  });

  describe('Service methods', () => {
    describe('createCursoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCursoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cargaHorasMinCurso: expect.any(Object),
            cargaHorasMinEstagio: expect.any(Object),
            percMaxEstagioAC: expect.any(Object),
            percMaxAtividadeDistancia: expect.any(Object),
            escola: expect.any(Object),
            tipo: expect.any(Object),
          }),
        );
      });

      it('passing ICurso should create a new form with FormGroup', () => {
        const formGroup = service.createCursoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            cargaHorasMinCurso: expect.any(Object),
            cargaHorasMinEstagio: expect.any(Object),
            percMaxEstagioAC: expect.any(Object),
            percMaxAtividadeDistancia: expect.any(Object),
            escola: expect.any(Object),
            tipo: expect.any(Object),
          }),
        );
      });
    });

    describe('getCurso', () => {
      it('should return NewCurso for default Curso initial value', () => {
        const formGroup = service.createCursoFormGroup(sampleWithNewData);

        const curso = service.getCurso(formGroup) as any;

        expect(curso).toMatchObject(sampleWithNewData);
      });

      it('should return NewCurso for empty Curso initial value', () => {
        const formGroup = service.createCursoFormGroup();

        const curso = service.getCurso(formGroup) as any;

        expect(curso).toMatchObject({});
      });

      it('should return ICurso', () => {
        const formGroup = service.createCursoFormGroup(sampleWithRequiredData);

        const curso = service.getCurso(formGroup) as any;

        expect(curso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICurso should not enable id FormControl', () => {
        const formGroup = service.createCursoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCurso should disable id FormControl', () => {
        const formGroup = service.createCursoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
