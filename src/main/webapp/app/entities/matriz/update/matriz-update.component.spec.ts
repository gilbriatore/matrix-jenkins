import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MatrizService } from '../service/matriz.service';
import { IMatriz } from '../matriz.model';
import { MatrizFormService } from './matriz-form.service';

import { MatrizUpdateComponent } from './matriz-update.component';

describe('Matriz Management Update Component', () => {
  let comp: MatrizUpdateComponent;
  let fixture: ComponentFixture<MatrizUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let matrizFormService: MatrizFormService;
  let matrizService: MatrizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatrizUpdateComponent],
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
      .overrideTemplate(MatrizUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatrizUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    matrizFormService = TestBed.inject(MatrizFormService);
    matrizService = TestBed.inject(MatrizService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const matriz: IMatriz = { id: 456 };

      activatedRoute.data = of({ matriz });
      comp.ngOnInit();

      expect(comp.matriz).toEqual(matriz);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatriz>>();
      const matriz = { id: 123 };
      jest.spyOn(matrizFormService, 'getMatriz').mockReturnValue(matriz);
      jest.spyOn(matrizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matriz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matriz }));
      saveSubject.complete();

      // THEN
      expect(matrizFormService.getMatriz).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(matrizService.update).toHaveBeenCalledWith(expect.objectContaining(matriz));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatriz>>();
      const matriz = { id: 123 };
      jest.spyOn(matrizFormService, 'getMatriz').mockReturnValue({ id: null });
      jest.spyOn(matrizService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matriz: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matriz }));
      saveSubject.complete();

      // THEN
      expect(matrizFormService.getMatriz).toHaveBeenCalled();
      expect(matrizService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMatriz>>();
      const matriz = { id: 123 };
      jest.spyOn(matrizService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matriz });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(matrizService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
