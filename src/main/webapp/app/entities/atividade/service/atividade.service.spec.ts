import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAtividade } from '../atividade.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../atividade.test-samples';

import { AtividadeService } from './atividade.service';

const requireRestSample: IAtividade = {
  ...sampleWithRequiredData,
};

describe('Atividade Service', () => {
  let service: AtividadeService;
  let httpMock: HttpTestingController;
  let expectedResult: IAtividade | IAtividade[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AtividadeService);
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

    it('should create a Atividade', () => {
      const atividade = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(atividade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Atividade', () => {
      const atividade = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(atividade).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Atividade', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Atividade', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Atividade', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAtividadeToCollectionIfMissing', () => {
      it('should add a Atividade to an empty array', () => {
        const atividade: IAtividade = sampleWithRequiredData;
        expectedResult = service.addAtividadeToCollectionIfMissing([], atividade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(atividade);
      });

      it('should not add a Atividade to an array that contains it', () => {
        const atividade: IAtividade = sampleWithRequiredData;
        const atividadeCollection: IAtividade[] = [
          {
            ...atividade,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAtividadeToCollectionIfMissing(atividadeCollection, atividade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Atividade to an array that doesn't contain it", () => {
        const atividade: IAtividade = sampleWithRequiredData;
        const atividadeCollection: IAtividade[] = [sampleWithPartialData];
        expectedResult = service.addAtividadeToCollectionIfMissing(atividadeCollection, atividade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(atividade);
      });

      it('should add only unique Atividade to an array', () => {
        const atividadeArray: IAtividade[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const atividadeCollection: IAtividade[] = [sampleWithRequiredData];
        expectedResult = service.addAtividadeToCollectionIfMissing(atividadeCollection, ...atividadeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const atividade: IAtividade = sampleWithRequiredData;
        const atividade2: IAtividade = sampleWithPartialData;
        expectedResult = service.addAtividadeToCollectionIfMissing([], atividade, atividade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(atividade);
        expect(expectedResult).toContain(atividade2);
      });

      it('should accept null and undefined values', () => {
        const atividade: IAtividade = sampleWithRequiredData;
        expectedResult = service.addAtividadeToCollectionIfMissing([], null, atividade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(atividade);
      });

      it('should return initial array if no Atividade is added', () => {
        const atividadeCollection: IAtividade[] = [sampleWithRequiredData];
        expectedResult = service.addAtividadeToCollectionIfMissing(atividadeCollection, undefined, null);
        expect(expectedResult).toEqual(atividadeCollection);
      });
    });

    describe('compareAtividade', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAtividade(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAtividade(entity1, entity2);
        const compareResult2 = service.compareAtividade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAtividade(entity1, entity2);
        const compareResult2 = service.compareAtividade(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAtividade(entity1, entity2);
        const compareResult2 = service.compareAtividade(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
