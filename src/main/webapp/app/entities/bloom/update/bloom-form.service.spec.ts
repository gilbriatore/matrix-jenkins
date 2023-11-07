import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bloom.test-samples';

import { BloomFormService } from './bloom-form.service';

describe('Bloom Form Service', () => {
  let service: BloomFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloomFormService);
  });

  describe('Service methods', () => {
    describe('createBloomFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBloomFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nivel: expect.any(Object),
          }),
        );
      });

      it('passing IBloom should create a new form with FormGroup', () => {
        const formGroup = service.createBloomFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nivel: expect.any(Object),
          }),
        );
      });
    });

    describe('getBloom', () => {
      it('should return NewBloom for default Bloom initial value', () => {
        const formGroup = service.createBloomFormGroup(sampleWithNewData);

        const bloom = service.getBloom(formGroup) as any;

        expect(bloom).toMatchObject(sampleWithNewData);
      });

      it('should return NewBloom for empty Bloom initial value', () => {
        const formGroup = service.createBloomFormGroup();

        const bloom = service.getBloom(formGroup) as any;

        expect(bloom).toMatchObject({});
      });

      it('should return IBloom', () => {
        const formGroup = service.createBloomFormGroup(sampleWithRequiredData);

        const bloom = service.getBloom(formGroup) as any;

        expect(bloom).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBloom should not enable id FormControl', () => {
        const formGroup = service.createBloomFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBloom should disable id FormControl', () => {
        const formGroup = service.createBloomFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
