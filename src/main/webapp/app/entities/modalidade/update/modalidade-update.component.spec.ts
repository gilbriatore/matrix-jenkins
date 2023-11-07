import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ModalidadeService } from '../service/modalidade.service';
import { IModalidade } from '../modalidade.model';
import { ModalidadeFormService } from './modalidade-form.service';

import { ModalidadeUpdateComponent } from './modalidade-update.component';

describe('Modalidade Management Update Component', () => {
  let comp: ModalidadeUpdateComponent;
  let fixture: ComponentFixture<ModalidadeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let modalidadeFormService: ModalidadeFormService;
  let modalidadeService: ModalidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ModalidadeUpdateComponent],
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
      .overrideTemplate(ModalidadeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModalidadeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    modalidadeFormService = TestBed.inject(ModalidadeFormService);
    modalidadeService = TestBed.inject(ModalidadeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const modalidade: IModalidade = { id: 456 };

      activatedRoute.data = of({ modalidade });
      comp.ngOnInit();

      expect(comp.modalidade).toEqual(modalidade);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModalidade>>();
      const modalidade = { id: 123 };
      jest.spyOn(modalidadeFormService, 'getModalidade').mockReturnValue(modalidade);
      jest.spyOn(modalidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modalidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modalidade }));
      saveSubject.complete();

      // THEN
      expect(modalidadeFormService.getModalidade).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(modalidadeService.update).toHaveBeenCalledWith(expect.objectContaining(modalidade));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModalidade>>();
      const modalidade = { id: 123 };
      jest.spyOn(modalidadeFormService, 'getModalidade').mockReturnValue({ id: null });
      jest.spyOn(modalidadeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modalidade: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: modalidade }));
      saveSubject.complete();

      // THEN
      expect(modalidadeFormService.getModalidade).toHaveBeenCalled();
      expect(modalidadeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IModalidade>>();
      const modalidade = { id: 123 };
      jest.spyOn(modalidadeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ modalidade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(modalidadeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
