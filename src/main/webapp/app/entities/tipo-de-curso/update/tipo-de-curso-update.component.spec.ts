import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TipoDeCursoService } from '../service/tipo-de-curso.service';
import { ITipoDeCurso } from '../tipo-de-curso.model';
import { TipoDeCursoFormService } from './tipo-de-curso-form.service';

import { TipoDeCursoUpdateComponent } from './tipo-de-curso-update.component';

describe('TipoDeCurso Management Update Component', () => {
  let comp: TipoDeCursoUpdateComponent;
  let fixture: ComponentFixture<TipoDeCursoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoDeCursoFormService: TipoDeCursoFormService;
  let tipoDeCursoService: TipoDeCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), TipoDeCursoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TipoDeCursoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoDeCursoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoDeCursoFormService = TestBed.inject(TipoDeCursoFormService);
    tipoDeCursoService = TestBed.inject(TipoDeCursoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoDeCurso: ITipoDeCurso = { id: 456 };

      activatedRoute.data = of({ tipoDeCurso });
      comp.ngOnInit();

      expect(comp.tipoDeCurso).toEqual(tipoDeCurso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDeCurso>>();
      const tipoDeCurso = { id: 123 };
      jest.spyOn(tipoDeCursoFormService, 'getTipoDeCurso').mockReturnValue(tipoDeCurso);
      jest.spyOn(tipoDeCursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDeCurso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDeCurso }));
      saveSubject.complete();

      // THEN
      expect(tipoDeCursoFormService.getTipoDeCurso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoDeCursoService.update).toHaveBeenCalledWith(expect.objectContaining(tipoDeCurso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDeCurso>>();
      const tipoDeCurso = { id: 123 };
      jest.spyOn(tipoDeCursoFormService, 'getTipoDeCurso').mockReturnValue({ id: null });
      jest.spyOn(tipoDeCursoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDeCurso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDeCurso }));
      saveSubject.complete();

      // THEN
      expect(tipoDeCursoFormService.getTipoDeCurso).toHaveBeenCalled();
      expect(tipoDeCursoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDeCurso>>();
      const tipoDeCurso = { id: 123 };
      jest.spyOn(tipoDeCursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDeCurso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoDeCursoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
