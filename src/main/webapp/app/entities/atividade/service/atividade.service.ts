import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAtividade, NewAtividade } from '../atividade.model';

export type PartialUpdateAtividade = Partial<IAtividade> & Pick<IAtividade, 'id'>;

export type EntityResponseType = HttpResponse<IAtividade>;
export type EntityArrayResponseType = HttpResponse<IAtividade[]>;

@Injectable({ providedIn: 'root' })
export class AtividadeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/atividades');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(atividade: NewAtividade): Observable<EntityResponseType> {
    return this.http.post<IAtividade>(this.resourceUrl, atividade, { observe: 'response' });
  }

  update(atividade: IAtividade): Observable<EntityResponseType> {
    return this.http.put<IAtividade>(`${this.resourceUrl}/${this.getAtividadeIdentifier(atividade)}`, atividade, { observe: 'response' });
  }

  partialUpdate(atividade: PartialUpdateAtividade): Observable<EntityResponseType> {
    return this.http.patch<IAtividade>(`${this.resourceUrl}/${this.getAtividadeIdentifier(atividade)}`, atividade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAtividade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAtividade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAtividadeIdentifier(atividade: Pick<IAtividade, 'id'>): number {
    return atividade.id;
  }

  compareAtividade(o1: Pick<IAtividade, 'id'> | null, o2: Pick<IAtividade, 'id'> | null): boolean {
    return o1 && o2 ? this.getAtividadeIdentifier(o1) === this.getAtividadeIdentifier(o2) : o1 === o2;
  }

  addAtividadeToCollectionIfMissing<Type extends Pick<IAtividade, 'id'>>(
    atividadeCollection: Type[],
    ...atividadesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const atividades: Type[] = atividadesToCheck.filter(isPresent);
    if (atividades.length > 0) {
      const atividadeCollectionIdentifiers = atividadeCollection.map(atividadeItem => this.getAtividadeIdentifier(atividadeItem)!);
      const atividadesToAdd = atividades.filter(atividadeItem => {
        const atividadeIdentifier = this.getAtividadeIdentifier(atividadeItem);
        if (atividadeCollectionIdentifiers.includes(atividadeIdentifier)) {
          return false;
        }
        atividadeCollectionIdentifiers.push(atividadeIdentifier);
        return true;
      });
      return [...atividadesToAdd, ...atividadeCollection];
    }
    return atividadeCollection;
  }
}
