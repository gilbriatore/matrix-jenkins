import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUnidade, NewUnidade } from '../unidade.model';

export type PartialUpdateUnidade = Partial<IUnidade> & Pick<IUnidade, 'id'>;

export type EntityResponseType = HttpResponse<IUnidade>;
export type EntityArrayResponseType = HttpResponse<IUnidade[]>;

@Injectable({ providedIn: 'root' })
export class UnidadeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/unidades');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(unidade: NewUnidade): Observable<EntityResponseType> {
    return this.http.post<IUnidade>(this.resourceUrl, unidade, { observe: 'response' });
  }

  update(unidade: IUnidade): Observable<EntityResponseType> {
    return this.http.put<IUnidade>(`${this.resourceUrl}/${this.getUnidadeIdentifier(unidade)}`, unidade, { observe: 'response' });
  }

  partialUpdate(unidade: PartialUpdateUnidade): Observable<EntityResponseType> {
    return this.http.patch<IUnidade>(`${this.resourceUrl}/${this.getUnidadeIdentifier(unidade)}`, unidade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUnidade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUnidade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUnidadeIdentifier(unidade: Pick<IUnidade, 'id'>): number {
    return unidade.id;
  }

  compareUnidade(o1: Pick<IUnidade, 'id'> | null, o2: Pick<IUnidade, 'id'> | null): boolean {
    return o1 && o2 ? this.getUnidadeIdentifier(o1) === this.getUnidadeIdentifier(o2) : o1 === o2;
  }

  addUnidadeToCollectionIfMissing<Type extends Pick<IUnidade, 'id'>>(
    unidadeCollection: Type[],
    ...unidadesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const unidades: Type[] = unidadesToCheck.filter(isPresent);
    if (unidades.length > 0) {
      const unidadeCollectionIdentifiers = unidadeCollection.map(unidadeItem => this.getUnidadeIdentifier(unidadeItem)!);
      const unidadesToAdd = unidades.filter(unidadeItem => {
        const unidadeIdentifier = this.getUnidadeIdentifier(unidadeItem);
        if (unidadeCollectionIdentifiers.includes(unidadeIdentifier)) {
          return false;
        }
        unidadeCollectionIdentifiers.push(unidadeIdentifier);
        return true;
      });
      return [...unidadesToAdd, ...unidadeCollection];
    }
    return unidadeCollection;
  }
}
