import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBloom } from '../bloom.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../bloom.test-samples';

import { BloomService } from './bloom.service';

const requireRestSample: IBloom = {
  ...sampleWithRequiredData,
};

describe('Bloom Service', () => {
  let service: BloomService;
  let httpMock: HttpTestingController;
  let expectedResult: IBloom | IBloom[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BloomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Bloom', () => {
      const bloom = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bloom).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bloom', () => {
      const bloom = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bloom).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Bloom', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Bloom', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Bloom', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBloomToCollectionIfMissing', () => {
      it('should add a Bloom to an empty array', () => {
        const bloom: IBloom = sampleWithRequiredData;
        expectedResult = service.addBloomToCollectionIfMissing([], bloom);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloom);
      });

      it('should not add a Bloom to an array that contains it', () => {
        const bloom: IBloom = sampleWithRequiredData;
        const bloomCollection: IBloom[] = [
          {
            ...bloom,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBloomToCollectionIfMissing(bloomCollection, bloom);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bloom to an array that doesn't contain it", () => {
        const bloom: IBloom = sampleWithRequiredData;
        const bloomCollection: IBloom[] = [sampleWithPartialData];
        expectedResult = service.addBloomToCollectionIfMissing(bloomCollection, bloom);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloom);
      });

      it('should add only unique Bloom to an array', () => {
        const bloomArray: IBloom[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bloomCollection: IBloom[] = [sampleWithRequiredData];
        expectedResult = service.addBloomToCollectionIfMissing(bloomCollection, ...bloomArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bloom: IBloom = sampleWithRequiredData;
        const bloom2: IBloom = sampleWithPartialData;
        expectedResult = service.addBloomToCollectionIfMissing([], bloom, bloom2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloom);
        expect(expectedResult).toContain(bloom2);
      });

      it('should accept null and undefined values', () => {
        const bloom: IBloom = sampleWithRequiredData;
        expectedResult = service.addBloomToCollectionIfMissing([], null, bloom, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloom);
      });

      it('should return initial array if no Bloom is added', () => {
        const bloomCollection: IBloom[] = [sampleWithRequiredData];
        expectedResult = service.addBloomToCollectionIfMissing(bloomCollection, undefined, null);
        expect(expectedResult).toEqual(bloomCollection);
      });
    });

    describe('compareBloom', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBloom(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBloom(entity1, entity2);
        const compareResult2 = service.compareBloom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBloom(entity1, entity2);
        const compareResult2 = service.compareBloom(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBloom(entity1, entity2);
        const compareResult2 = service.compareBloom(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
