import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IModalidade } from '../modalidade.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../modalidade.test-samples';

import { ModalidadeService } from './modalidade.service';

const requireRestSample: IModalidade = {
  ...sampleWithRequiredData,
};

describe('Modalidade Service', () => {
  let service: ModalidadeService;
  let httpMock: HttpTestingController;
  let expectedResult: IModalidade | IModalidade[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ModalidadeService);
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

    it('should create a Modalidade', () => {
      const modalidade = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(modalidade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Modalidade', () => {
      const modalidade = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(modalidade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Modalidade', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Modalidade', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Modalidade', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addModalidadeToCollectionIfMissing', () => {
      it('should add a Modalidade to an empty array', () => {
        const modalidade: IModalidade = sampleWithRequiredData;
        expectedResult = service.addModalidadeToCollectionIfMissing([], modalidade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(modalidade);
      });

      it('should not add a Modalidade to an array that contains it', () => {
        const modalidade: IModalidade = sampleWithRequiredData;
        const modalidadeCollection: IModalidade[] = [
          {
            ...modalidade,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addModalidadeToCollectionIfMissing(modalidadeCollection, modalidade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Modalidade to an array that doesn't contain it", () => {
        const modalidade: IModalidade = sampleWithRequiredData;
        const modalidadeCollection: IModalidade[] = [sampleWithPartialData];
        expectedResult = service.addModalidadeToCollectionIfMissing(modalidadeCollection, modalidade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(modalidade);
      });

      it('should add only unique Modalidade to an array', () => {
        const modalidadeArray: IModalidade[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const modalidadeCollection: IModalidade[] = [sampleWithRequiredData];
        expectedResult = service.addModalidadeToCollectionIfMissing(modalidadeCollection, ...modalidadeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const modalidade: IModalidade = sampleWithRequiredData;
        const modalidade2: IModalidade = sampleWithPartialData;
        expectedResult = service.addModalidadeToCollectionIfMissing([], modalidade, modalidade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(modalidade);
        expect(expectedResult).toContain(modalidade2);
      });

      it('should accept null and undefined values', () => {
        const modalidade: IModalidade = sampleWithRequiredData;
        expectedResult = service.addModalidadeToCollectionIfMissing([], null, modalidade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(modalidade);
      });

      it('should return initial array if no Modalidade is added', () => {
        const modalidadeCollection: IModalidade[] = [sampleWithRequiredData];
        expectedResult = service.addModalidadeToCollectionIfMissing(modalidadeCollection, undefined, null);
        expect(expectedResult).toEqual(modalidadeCollection);
      });
    });

    describe('compareModalidade', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareModalidade(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareModalidade(entity1, entity2);
        const compareResult2 = service.compareModalidade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareModalidade(entity1, entity2);
        const compareResult2 = service.compareModalidade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareModalidade(entity1, entity2);
        const compareResult2 = service.compareModalidade(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
