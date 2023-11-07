import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITipoDeCurso } from '../tipo-de-curso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tipo-de-curso.test-samples';

import { TipoDeCursoService } from './tipo-de-curso.service';

const requireRestSample: ITipoDeCurso = {
  ...sampleWithRequiredData,
};

describe('TipoDeCurso Service', () => {
  let service: TipoDeCursoService;
  let httpMock: HttpTestingController;
  let expectedResult: ITipoDeCurso | ITipoDeCurso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TipoDeCursoService);
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

    it('should create a TipoDeCurso', () => {
      const tipoDeCurso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tipoDeCurso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoDeCurso', () => {
      const tipoDeCurso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tipoDeCurso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoDeCurso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoDeCurso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TipoDeCurso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTipoDeCursoToCollectionIfMissing', () => {
      it('should add a TipoDeCurso to an empty array', () => {
        const tipoDeCurso: ITipoDeCurso = sampleWithRequiredData;
        expectedResult = service.addTipoDeCursoToCollectionIfMissing([], tipoDeCurso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDeCurso);
      });

      it('should not add a TipoDeCurso to an array that contains it', () => {
        const tipoDeCurso: ITipoDeCurso = sampleWithRequiredData;
        const tipoDeCursoCollection: ITipoDeCurso[] = [
          {
            ...tipoDeCurso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTipoDeCursoToCollectionIfMissing(tipoDeCursoCollection, tipoDeCurso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoDeCurso to an array that doesn't contain it", () => {
        const tipoDeCurso: ITipoDeCurso = sampleWithRequiredData;
        const tipoDeCursoCollection: ITipoDeCurso[] = [sampleWithPartialData];
        expectedResult = service.addTipoDeCursoToCollectionIfMissing(tipoDeCursoCollection, tipoDeCurso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDeCurso);
      });

      it('should add only unique TipoDeCurso to an array', () => {
        const tipoDeCursoArray: ITipoDeCurso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tipoDeCursoCollection: ITipoDeCurso[] = [sampleWithRequiredData];
        expectedResult = service.addTipoDeCursoToCollectionIfMissing(tipoDeCursoCollection, ...tipoDeCursoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoDeCurso: ITipoDeCurso = sampleWithRequiredData;
        const tipoDeCurso2: ITipoDeCurso = sampleWithPartialData;
        expectedResult = service.addTipoDeCursoToCollectionIfMissing([], tipoDeCurso, tipoDeCurso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDeCurso);
        expect(expectedResult).toContain(tipoDeCurso2);
      });

      it('should accept null and undefined values', () => {
        const tipoDeCurso: ITipoDeCurso = sampleWithRequiredData;
        expectedResult = service.addTipoDeCursoToCollectionIfMissing([], null, tipoDeCurso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDeCurso);
      });

      it('should return initial array if no TipoDeCurso is added', () => {
        const tipoDeCursoCollection: ITipoDeCurso[] = [sampleWithRequiredData];
        expectedResult = service.addTipoDeCursoToCollectionIfMissing(tipoDeCursoCollection, undefined, null);
        expect(expectedResult).toEqual(tipoDeCursoCollection);
      });
    });

    describe('compareTipoDeCurso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTipoDeCurso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTipoDeCurso(entity1, entity2);
        const compareResult2 = service.compareTipoDeCurso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTipoDeCurso(entity1, entity2);
        const compareResult2 = service.compareTipoDeCurso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTipoDeCurso(entity1, entity2);
        const compareResult2 = service.compareTipoDeCurso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
