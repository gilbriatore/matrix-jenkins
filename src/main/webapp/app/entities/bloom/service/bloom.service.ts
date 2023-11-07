import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBloom, NewBloom } from '../bloom.model';

export type PartialUpdateBloom = Partial<IBloom> & Pick<IBloom, 'id'>;

export type EntityResponseType = HttpResponse<IBloom>;
export type EntityArrayResponseType = HttpResponse<IBloom[]>;

@Injectable({ providedIn: 'root' })
export class BloomService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blooms');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(bloom: NewBloom): Observable<EntityResponseType> {
    return this.http.post<IBloom>(this.resourceUrl, bloom, { observe: 'response' });
  }

  update(bloom: IBloom): Observable<EntityResponseType> {
    return this.http.put<IBloom>(`${this.resourceUrl}/${this.getBloomIdentifier(bloom)}`, bloom, { observe: 'response' });
  }

  partialUpdate(bloom: PartialUpdateBloom): Observable<EntityResponseType> {
    return this.http.patch<IBloom>(`${this.resourceUrl}/${this.getBloomIdentifier(bloom)}`, bloom, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBloom>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBloom[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBloomIdentifier(bloom: Pick<IBloom, 'id'>): number {
    return bloom.id;
  }

  compareBloom(o1: Pick<IBloom, 'id'> | null, o2: Pick<IBloom, 'id'> | null): boolean {
    return o1 && o2 ? this.getBloomIdentifier(o1) === this.getBloomIdentifier(o2) : o1 === o2;
  }

  addBloomToCollectionIfMissing<Type extends Pick<IBloom, 'id'>>(
    bloomCollection: Type[],
    ...bloomsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const blooms: Type[] = bloomsToCheck.filter(isPresent);
    if (blooms.length > 0) {
      const bloomCollectionIdentifiers = bloomCollection.map(bloomItem => this.getBloomIdentifier(bloomItem)!);
      const bloomsToAdd = blooms.filter(bloomItem => {
        const bloomIdentifier = this.getBloomIdentifier(bloomItem);
        if (bloomCollectionIdentifiers.includes(bloomIdentifier)) {
          return false;
        }
        bloomCollectionIdentifiers.push(bloomIdentifier);
        return true;
      });
      return [...bloomsToAdd, ...bloomCollection];
    }
    return bloomCollection;
  }
}
