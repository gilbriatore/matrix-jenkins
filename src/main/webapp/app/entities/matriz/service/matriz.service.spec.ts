import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMatriz } from '../matriz.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../matriz.test-samples';

import { MatrizService } from './matriz.service';

const requireRestSample: IMatriz = {
  ...sampleWithRequiredData,
};

describe('Matriz Service', () => {
  let service: MatrizService;
  let httpMock: HttpTestingController;
  let expectedResult: IMatriz | IMatriz[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MatrizService);
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

    it('should create a Matriz', () => {
      const matriz = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(matriz).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Matriz', () => {
      const matriz = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(matriz).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Matriz', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Matriz', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Matriz', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMatrizToCollectionIfMissing', () => {
      it('should add a Matriz to an empty array', () => {
        const matriz: IMatriz = sampleWithRequiredData;
        expectedResult = service.addMatrizToCollectionIfMissing([], matriz);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matriz);
      });

      it('should not add a Matriz to an array that contains it', () => {
        const matriz: IMatriz = sampleWithRequiredData;
        const matrizCollection: IMatriz[] = [
          {
            ...matriz,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMatrizToCollectionIfMissing(matrizCollection, matriz);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Matriz to an array that doesn't contain it", () => {
        const matriz: IMatriz = sampleWithRequiredData;
        const matrizCollection: IMatriz[] = [sampleWithPartialData];
        expectedResult = service.addMatrizToCollectionIfMissing(matrizCollection, matriz);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matriz);
      });

      it('should add only unique Matriz to an array', () => {
        const matrizArray: IMatriz[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const matrizCollection: IMatriz[] = [sampleWithRequiredData];
        expectedResult = service.addMatrizToCollectionIfMissing(matrizCollection, ...matrizArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const matriz: IMatriz = sampleWithRequiredData;
        const matriz2: IMatriz = sampleWithPartialData;
        expectedResult = service.addMatrizToCollectionIfMissing([], matriz, matriz2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matriz);
        expect(expectedResult).toContain(matriz2);
      });

      it('should accept null and undefined values', () => {
        const matriz: IMatriz = sampleWithRequiredData;
        expectedResult = service.addMatrizToCollectionIfMissing([], null, matriz, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matriz);
      });

      it('should return initial array if no Matriz is added', () => {
        const matrizCollection: IMatriz[] = [sampleWithRequiredData];
        expectedResult = service.addMatrizToCollectionIfMissing(matrizCollection, undefined, null);
        expect(expectedResult).toEqual(matrizCollection);
      });
    });

    describe('compareMatriz', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMatriz(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMatriz(entity1, entity2);
        const compareResult2 = service.compareMatriz(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMatriz(entity1, entity2);
        const compareResult2 = service.compareMatriz(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMatriz(entity1, entity2);
        const compareResult2 = service.compareMatriz(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
