import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEscola } from '../escola.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../escola.test-samples';

import { EscolaService } from './escola.service';

const requireRestSample: IEscola = {
  ...sampleWithRequiredData,
};

describe('Escola Service', () => {
  let service: EscolaService;
  let httpMock: HttpTestingController;
  let expectedResult: IEscola | IEscola[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EscolaService);
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

    it('should create a Escola', () => {
      const escola = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(escola).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Escola', () => {
      const escola = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(escola).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Escola', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Escola', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Escola', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEscolaToCollectionIfMissing', () => {
      it('should add a Escola to an empty array', () => {
        const escola: IEscola = sampleWithRequiredData;
        expectedResult = service.addEscolaToCollectionIfMissing([], escola);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(escola);
      });

      it('should not add a Escola to an array that contains it', () => {
        const escola: IEscola = sampleWithRequiredData;
        const escolaCollection: IEscola[] = [
          {
            ...escola,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEscolaToCollectionIfMissing(escolaCollection, escola);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Escola to an array that doesn't contain it", () => {
        const escola: IEscola = sampleWithRequiredData;
        const escolaCollection: IEscola[] = [sampleWithPartialData];
        expectedResult = service.addEscolaToCollectionIfMissing(escolaCollection, escola);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(escola);
      });

      it('should add only unique Escola to an array', () => {
        const escolaArray: IEscola[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const escolaCollection: IEscola[] = [sampleWithRequiredData];
        expectedResult = service.addEscolaToCollectionIfMissing(escolaCollection, ...escolaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const escola: IEscola = sampleWithRequiredData;
        const escola2: IEscola = sampleWithPartialData;
        expectedResult = service.addEscolaToCollectionIfMissing([], escola, escola2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(escola);
        expect(expectedResult).toContain(escola2);
      });

      it('should accept null and undefined values', () => {
        const escola: IEscola = sampleWithRequiredData;
        expectedResult = service.addEscolaToCollectionIfMissing([], null, escola, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(escola);
      });

      it('should return initial array if no Escola is added', () => {
        const escolaCollection: IEscola[] = [sampleWithRequiredData];
        expectedResult = service.addEscolaToCollectionIfMissing(escolaCollection, undefined, null);
        expect(expectedResult).toEqual(escolaCollection);
      });
    });

    describe('compareEscola', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEscola(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEscola(entity1, entity2);
        const compareResult2 = service.compareEscola(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEscola(entity1, entity2);
        const compareResult2 = service.compareEscola(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEscola(entity1, entity2);
        const compareResult2 = service.compareEscola(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
