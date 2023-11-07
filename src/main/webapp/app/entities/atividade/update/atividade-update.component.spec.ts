import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AtividadeService } from '../service/atividade.service';
import { IAtividade } from '../atividade.model';
import { AtividadeFormService } from './atividade-form.service';

import { AtividadeUpdateComponent } from './atividade-update.component';

describe('Atividade Management Update Component', () => {
  let comp: AtividadeUpdateComponent;
  let fixture: ComponentFixture<AtividadeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let atividadeFormService: AtividadeFormService;
  let atividadeService: AtividadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AtividadeUpdateComponent],
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
      .overrideTemplate(AtividadeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AtividadeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    atividadeFormService = TestBed.inject(AtividadeFormService);
    atividadeService = TestBed.inject(AtividadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const atividade: IAtividade = { id: 456 };

      activatedRoute.data = of({ atividade });
      comp.ngOnInit();

      expect(comp.atividade).toEqual(atividade);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtividade>>();
      const atividade = { id: 123 };
      jest.spyOn(atividadeFormService, 'getAtividade').mockReturnValue(atividade);
      jest.spyOn(atividadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atividade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atividade }));
      saveSubject.complete();

      // THEN
      expect(atividadeFormService.getAtividade).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(atividadeService.update).toHaveBeenCalledWith(expect.objectContaining(atividade));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtividade>>();
      const atividade = { id: 123 };
      jest.spyOn(atividadeFormService, 'getAtividade').mockReturnValue({ id: null });
      jest.spyOn(atividadeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atividade: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: atividade }));
      saveSubject.complete();

      // THEN
      expect(atividadeFormService.getAtividade).toHaveBeenCalled();
      expect(atividadeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAtividade>>();
      const atividade = { id: 123 };
      jest.spyOn(atividadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ atividade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(atividadeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
