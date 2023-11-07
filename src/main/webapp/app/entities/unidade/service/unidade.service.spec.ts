import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUnidade } from '../unidade.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../unidade.test-samples';

import { UnidadeService } from './unidade.service';

const requireRestSample: IUnidade = {
  ...sampleWithRequiredData,
};

describe('Unidade Service', () => {
  let service: UnidadeService;
  let httpMock: HttpTestingController;
  let expectedResult: IUnidade | IUnidade[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UnidadeService);
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

    it('should create a Unidade', () => {
      const unidade = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(unidade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Unidade', () => {
      const unidade = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(unidade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Unidade', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Unidade', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Unidade', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUnidadeToCollectionIfMissing', () => {
      it('should add a Unidade to an empty array', () => {
        const unidade: IUnidade = sampleWithRequiredData;
        expectedResult = service.addUnidadeToCollectionIfMissing([], unidade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unidade);
      });

      it('should not add a Unidade to an array that contains it', () => {
        const unidade: IUnidade = sampleWithRequiredData;
        const unidadeCollection: IUnidade[] = [
          {
            ...unidade,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUnidadeToCollectionIfMissing(unidadeCollection, unidade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Unidade to an array that doesn't contain it", () => {
        const unidade: IUnidade = sampleWithRequiredData;
        const unidadeCollection: IUnidade[] = [sampleWithPartialData];
        expectedResult = service.addUnidadeToCollectionIfMissing(unidadeCollection, unidade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unidade);
      });

      it('should add only unique Unidade to an array', () => {
        const unidadeArray: IUnidade[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const unidadeCollection: IUnidade[] = [sampleWithRequiredData];
        expectedResult = service.addUnidadeToCollectionIfMissing(unidadeCollection, ...unidadeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const unidade: IUnidade = sampleWithRequiredData;
        const unidade2: IUnidade = sampleWithPartialData;
        expectedResult = service.addUnidadeToCollectionIfMissing([], unidade, unidade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(unidade);
        expect(expectedResult).toContain(unidade2);
      });

      it('should accept null and undefined values', () => {
        const unidade: IUnidade = sampleWithRequiredData;
        expectedResult = service.addUnidadeToCollectionIfMissing([], null, unidade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(unidade);
      });

      it('should return initial array if no Unidade is added', () => {
        const unidadeCollection: IUnidade[] = [sampleWithRequiredData];
        expectedResult = service.addUnidadeToCollectionIfMissing(unidadeCollection, undefined, null);
        expect(expectedResult).toEqual(unidadeCollection);
      });
    });

    describe('compareUnidade', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUnidade(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUnidade(entity1, entity2);
        const compareResult2 = service.compareUnidade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUnidade(entity1, entity2);
        const compareResult2 = service.compareUnidade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUnidade(entity1, entity2);
        const compareResult2 = service.compareUnidade(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
