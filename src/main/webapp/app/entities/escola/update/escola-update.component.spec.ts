import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EscolaService } from '../service/escola.service';
import { IEscola } from '../escola.model';
import { EscolaFormService } from './escola-form.service';

import { EscolaUpdateComponent } from './escola-update.component';

describe('Escola Management Update Component', () => {
  let comp: EscolaUpdateComponent;
  let fixture: ComponentFixture<EscolaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let escolaFormService: EscolaFormService;
  let escolaService: EscolaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EscolaUpdateComponent],
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
      .overrideTemplate(EscolaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EscolaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    escolaFormService = TestBed.inject(EscolaFormService);
    escolaService = TestBed.inject(EscolaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const escola: IEscola = { id: 456 };

      activatedRoute.data = of({ escola });
      comp.ngOnInit();

      expect(comp.escola).toEqual(escola);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEscola>>();
      const escola = { id: 123 };
      jest.spyOn(escolaFormService, 'getEscola').mockReturnValue(escola);
      jest.spyOn(escolaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ escola });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: escola }));
      saveSubject.complete();

      // THEN
      expect(escolaFormService.getEscola).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(escolaService.update).toHaveBeenCalledWith(expect.objectContaining(escola));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEscola>>();
      const escola = { id: 123 };
      jest.spyOn(escolaFormService, 'getEscola').mockReturnValue({ id: null });
      jest.spyOn(escolaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ escola: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: escola }));
      saveSubject.complete();

      // THEN
      expect(escolaFormService.getEscola).toHaveBeenCalled();
      expect(escolaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEscola>>();
      const escola = { id: 123 };
      jest.spyOn(escolaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ escola });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(escolaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
