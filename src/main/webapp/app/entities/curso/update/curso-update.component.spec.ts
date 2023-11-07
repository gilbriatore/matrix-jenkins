import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IEscola } from 'app/entities/escola/escola.model';
import { EscolaService } from 'app/entities/escola/service/escola.service';
import { ITipoDeCurso } from 'app/entities/tipo-de-curso/tipo-de-curso.model';
import { TipoDeCursoService } from 'app/entities/tipo-de-curso/service/tipo-de-curso.service';
import { ICurso } from '../curso.model';
import { CursoService } from '../service/curso.service';
import { CursoFormService } from './curso-form.service';

import { CursoUpdateComponent } from './curso-update.component';

describe('Curso Management Update Component', () => {
  let comp: CursoUpdateComponent;
  let fixture: ComponentFixture<CursoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cursoFormService: CursoFormService;
  let cursoService: CursoService;
  let escolaService: EscolaService;
  let tipoDeCursoService: TipoDeCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CursoUpdateComponent],
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
      .overrideTemplate(CursoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CursoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cursoFormService = TestBed.inject(CursoFormService);
    cursoService = TestBed.inject(CursoService);
    escolaService = TestBed.inject(EscolaService);
    tipoDeCursoService = TestBed.inject(TipoDeCursoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Escola query and add missing value', () => {
      const curso: ICurso = { id: 456 };
      const escola: IEscola = { id: 22599 };
      curso.escola = escola;

      const escolaCollection: IEscola[] = [{ id: 4446 }];
      jest.spyOn(escolaService, 'query').mockReturnValue(of(new HttpResponse({ body: escolaCollection })));
      const additionalEscolas = [escola];
      const expectedCollection: IEscola[] = [...additionalEscolas, ...escolaCollection];
      jest.spyOn(escolaService, 'addEscolaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ curso });
      comp.ngOnInit();

      expect(escolaService.query).toHaveBeenCalled();
      expect(escolaService.addEscolaToCollectionIfMissing).toHaveBeenCalledWith(
        escolaCollection,
        ...additionalEscolas.map(expect.objectContaining),
      );
      expect(comp.escolasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TipoDeCurso query and add missing value', () => {
      const curso: ICurso = { id: 456 };
      const tipo: ITipoDeCurso = { id: 9405 };
      curso.tipo = tipo;

      const tipoDeCursoCollection: ITipoDeCurso[] = [{ id: 10450 }];
      jest.spyOn(tipoDeCursoService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoDeCursoCollection })));
      const additionalTipoDeCursos = [tipo];
      const expectedCollection: ITipoDeCurso[] = [...additionalTipoDeCursos, ...tipoDeCursoCollection];
      jest.spyOn(tipoDeCursoService, 'addTipoDeCursoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ curso });
      comp.ngOnInit();

      expect(tipoDeCursoService.query).toHaveBeenCalled();
      expect(tipoDeCursoService.addTipoDeCursoToCollectionIfMissing).toHaveBeenCalledWith(
        tipoDeCursoCollection,
        ...additionalTipoDeCursos.map(expect.objectContaining),
      );
      expect(comp.tipoDeCursosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const curso: ICurso = { id: 456 };
      const escola: IEscola = { id: 2082 };
      curso.escola = escola;
      const tipo: ITipoDeCurso = { id: 30832 };
      curso.tipo = tipo;

      activatedRoute.data = of({ curso });
      comp.ngOnInit();

      expect(comp.escolasSharedCollection).toContain(escola);
      expect(comp.tipoDeCursosSharedCollection).toContain(tipo);
      expect(comp.curso).toEqual(curso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurso>>();
      const curso = { id: 123 };
      jest.spyOn(cursoFormService, 'getCurso').mockReturnValue(curso);
      jest.spyOn(cursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: curso }));
      saveSubject.complete();

      // THEN
      expect(cursoFormService.getCurso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cursoService.update).toHaveBeenCalledWith(expect.objectContaining(curso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurso>>();
      const curso = { id: 123 };
      jest.spyOn(cursoFormService, 'getCurso').mockReturnValue({ id: null });
      jest.spyOn(cursoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: curso }));
      saveSubject.complete();

      // THEN
      expect(cursoFormService.getCurso).toHaveBeenCalled();
      expect(cursoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICurso>>();
      const curso = { id: 123 };
      jest.spyOn(cursoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ curso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cursoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEscola', () => {
      it('Should forward to escolaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(escolaService, 'compareEscola');
        comp.compareEscola(entity, entity2);
        expect(escolaService.compareEscola).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTipoDeCurso', () => {
      it('Should forward to tipoDeCursoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tipoDeCursoService, 'compareTipoDeCurso');
        comp.compareTipoDeCurso(entity, entity2);
        expect(tipoDeCursoService.compareTipoDeCurso).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
