import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModalidade, NewModalidade } from '../modalidade.model';

export type PartialUpdateModalidade = Partial<IModalidade> & Pick<IModalidade, 'id'>;

export type EntityResponseType = HttpResponse<IModalidade>;
export type EntityArrayResponseType = HttpResponse<IModalidade[]>;

@Injectable({ providedIn: 'root' })
export class ModalidadeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/modalidades');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(modalidade: NewModalidade): Observable<EntityResponseType> {
    return this.http.post<IModalidade>(this.resourceUrl, modalidade, { observe: 'response' });
  }

  update(modalidade: IModalidade): Observable<EntityResponseType> {
    return this.http.put<IModalidade>(`${this.resourceUrl}/${this.getModalidadeIdentifier(modalidade)}`, modalidade, {
      observe: 'response',
    });
  }

  partialUpdate(modalidade: PartialUpdateModalidade): Observable<EntityResponseType> {
    return this.http.patch<IModalidade>(`${this.resourceUrl}/${this.getModalidadeIdentifier(modalidade)}`, modalidade, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IModalidade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModalidade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getModalidadeIdentifier(modalidade: Pick<IModalidade, 'id'>): number {
    return modalidade.id;
  }

  compareModalidade(o1: Pick<IModalidade, 'id'> | null, o2: Pick<IModalidade, 'id'> | null): boolean {
    return o1 && o2 ? this.getModalidadeIdentifier(o1) === this.getModalidadeIdentifier(o2) : o1 === o2;
  }

  addModalidadeToCollectionIfMissing<Type extends Pick<IModalidade, 'id'>>(
    modalidadeCollection: Type[],
    ...modalidadesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const modalidades: Type[] = modalidadesToCheck.filter(isPresent);
    if (modalidades.length > 0) {
      const modalidadeCollectionIdentifiers = modalidadeCollection.map(modalidadeItem => this.getModalidadeIdentifier(modalidadeItem)!);
      const modalidadesToAdd = modalidades.filter(modalidadeItem => {
        const modalidadeIdentifier = this.getModalidadeIdentifier(modalidadeItem);
        if (modalidadeCollectionIdentifiers.includes(modalidadeIdentifier)) {
          return false;
        }
        modalidadeCollectionIdentifiers.push(modalidadeIdentifier);
        return true;
      });
      return [...modalidadesToAdd, ...modalidadeCollection];
    }
    return modalidadeCollection;
  }
}
