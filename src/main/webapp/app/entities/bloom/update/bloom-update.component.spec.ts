import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BloomService } from '../service/bloom.service';
import { IBloom } from '../bloom.model';
import { BloomFormService } from './bloom-form.service';

import { BloomUpdateComponent } from './bloom-update.component';

describe('Bloom Management Update Component', () => {
  let comp: BloomUpdateComponent;
  let fixture: ComponentFixture<BloomUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bloomFormService: BloomFormService;
  let bloomService: BloomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BloomUpdateComponent],
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
      .overrideTemplate(BloomUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BloomUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bloomFormService = TestBed.inject(BloomFormService);
    bloomService = TestBed.inject(BloomService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bloom: IBloom = { id: 456 };

      activatedRoute.data = of({ bloom });
      comp.ngOnInit();

      expect(comp.bloom).toEqual(bloom);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBloom>>();
      const bloom = { id: 123 };
      jest.spyOn(bloomFormService, 'getBloom').mockReturnValue(bloom);
      jest.spyOn(bloomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloom }));
      saveSubject.complete();

      // THEN
      expect(bloomFormService.getBloom).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bloomService.update).toHaveBeenCalledWith(expect.objectContaining(bloom));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBloom>>();
      const bloom = { id: 123 };
      jest.spyOn(bloomFormService, 'getBloom').mockReturnValue({ id: null });
      jest.spyOn(bloomService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloom: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloom }));
      saveSubject.complete();

      // THEN
      expect(bloomFormService.getBloom).toHaveBeenCalled();
      expect(bloomService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBloom>>();
      const bloom = { id: 123 };
      jest.spyOn(bloomService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloom });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bloomService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
