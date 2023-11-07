import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEscola, NewEscola } from '../escola.model';

export type PartialUpdateEscola = Partial<IEscola> & Pick<IEscola, 'id'>;

export type EntityResponseType = HttpResponse<IEscola>;
export type EntityArrayResponseType = HttpResponse<IEscola[]>;

@Injectable({ providedIn: 'root' })
export class EscolaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/escolas');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(escola: NewEscola): Observable<EntityResponseType> {
    return this.http.post<IEscola>(this.resourceUrl, escola, { observe: 'response' });
  }

  update(escola: IEscola): Observable<EntityResponseType> {
    return this.http.put<IEscola>(`${this.resourceUrl}/${this.getEscolaIdentifier(escola)}`, escola, { observe: 'response' });
  }

  partialUpdate(escola: PartialUpdateEscola): Observable<EntityResponseType> {
    return this.http.patch<IEscola>(`${this.resourceUrl}/${this.getEscolaIdentifier(escola)}`, escola, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEscola>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEscola[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEscolaIdentifier(escola: Pick<IEscola, 'id'>): number {
    return escola.id;
  }

  compareEscola(o1: Pick<IEscola, 'id'> | null, o2: Pick<IEscola, 'id'> | null): boolean {
    return o1 && o2 ? this.getEscolaIdentifier(o1) === this.getEscolaIdentifier(o2) : o1 === o2;
  }

  addEscolaToCollectionIfMissing<Type extends Pick<IEscola, 'id'>>(
    escolaCollection: Type[],
    ...escolasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const escolas: Type[] = escolasToCheck.filter(isPresent);
    if (escolas.length > 0) {
      const escolaCollectionIdentifiers = escolaCollection.map(escolaItem => this.getEscolaIdentifier(escolaItem)!);
      const escolasToAdd = escolas.filter(escolaItem => {
        const escolaIdentifier = this.getEscolaIdentifier(escolaItem);
        if (escolaCollectionIdentifiers.includes(escolaIdentifier)) {
          return false;
        }
        escolaCollectionIdentifiers.push(escolaIdentifier);
        return true;
      });
      return [...escolasToAdd, ...escolaCollection];
    }
    return escolaCollection;
  }
}
