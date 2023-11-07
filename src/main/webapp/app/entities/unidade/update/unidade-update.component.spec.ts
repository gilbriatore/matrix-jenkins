import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UnidadeService } from '../service/unidade.service';
import { IUnidade } from '../unidade.model';
import { UnidadeFormService } from './unidade-form.service';

import { UnidadeUpdateComponent } from './unidade-update.component';

describe('Unidade Management Update Component', () => {
  let comp: UnidadeUpdateComponent;
  let fixture: ComponentFixture<UnidadeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let unidadeFormService: UnidadeFormService;
  let unidadeService: UnidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UnidadeUpdateComponent],
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
      .overrideTemplate(UnidadeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnidadeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    unidadeFormService = TestBed.inject(UnidadeFormService);
    unidadeService = TestBed.inject(UnidadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const unidade: IUnidade = { id: 456 };

      activatedRoute.data = of({ unidade });
      comp.ngOnInit();

      expect(comp.unidade).toEqual(unidade);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidade>>();
      const unidade = { id: 123 };
      jest.spyOn(unidadeFormService, 'getUnidade').mockReturnValue(unidade);
      jest.spyOn(unidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unidade }));
      saveSubject.complete();

      // THEN
      expect(unidadeFormService.getUnidade).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(unidadeService.update).toHaveBeenCalledWith(expect.objectContaining(unidade));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidade>>();
      const unidade = { id: 123 };
      jest.spyOn(unidadeFormService, 'getUnidade').mockReturnValue({ id: null });
      jest.spyOn(unidadeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidade: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unidade }));
      saveSubject.complete();

      // THEN
      expect(unidadeFormService.getUnidade).toHaveBeenCalled();
      expect(unidadeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUnidade>>();
      const unidade = { id: 123 };
      jest.spyOn(unidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(unidadeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
