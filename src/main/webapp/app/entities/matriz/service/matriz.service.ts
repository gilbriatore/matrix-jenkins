import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMatriz, NewMatriz } from '../matriz.model';

export type PartialUpdateMatriz = Partial<IMatriz> & Pick<IMatriz, 'id'>;

export type EntityResponseType = HttpResponse<IMatriz>;
export type EntityArrayResponseType = HttpResponse<IMatriz[]>;

@Injectable({ providedIn: 'root' })
export class MatrizService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/matrizs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(matriz: NewMatriz): Observable<EntityResponseType> {
    return this.http.post<IMatriz>(this.resourceUrl, matriz, { observe: 'response' });
  }

  update(matriz: IMatriz): Observable<EntityResponseType> {
    return this.http.put<IMatriz>(`${this.resourceUrl}/${this.getMatrizIdentifier(matriz)}`, matriz, { observe: 'response' });
  }

  partialUpdate(matriz: PartialUpdateMatriz): Observable<EntityResponseType> {
    return this.http.patch<IMatriz>(`${this.resourceUrl}/${this.getMatrizIdentifier(matriz)}`, matriz, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMatriz>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMatriz[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMatrizIdentifier(matriz: Pick<IMatriz, 'id'>): number {
    return matriz.id;
  }

  compareMatriz(o1: Pick<IMatriz, 'id'> | null, o2: Pick<IMatriz, 'id'> | null): boolean {
    return o1 && o2 ? this.getMatrizIdentifier(o1) === this.getMatrizIdentifier(o2) : o1 === o2;
  }

  addMatrizToCollectionIfMissing<Type extends Pick<IMatriz, 'id'>>(
    matrizCollection: Type[],
    ...matrizsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const matrizs: Type[] = matrizsToCheck.filter(isPresent);
    if (matrizs.length > 0) {
      const matrizCollectionIdentifiers = matrizCollection.map(matrizItem => this.getMatrizIdentifier(matrizItem)!);
      const matrizsToAdd = matrizs.filter(matrizItem => {
        const matrizIdentifier = this.getMatrizIdentifier(matrizItem);
        if (matrizCollectionIdentifiers.includes(matrizIdentifier)) {
          return false;
        }
        matrizCollectionIdentifiers.push(matrizIdentifier);
        return true;
      });
      return [...matrizsToAdd, ...matrizCollection];
    }
    return matrizCollection;
  }
}
