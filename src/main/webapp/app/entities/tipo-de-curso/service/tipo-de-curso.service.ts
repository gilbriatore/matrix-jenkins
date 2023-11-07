import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoDeCurso, NewTipoDeCurso } from '../tipo-de-curso.model';

export type PartialUpdateTipoDeCurso = Partial<ITipoDeCurso> & Pick<ITipoDeCurso, 'id'>;

export type EntityResponseType = HttpResponse<ITipoDeCurso>;
export type EntityArrayResponseType = HttpResponse<ITipoDeCurso[]>;

@Injectable({ providedIn: 'root' })
export class TipoDeCursoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-de-cursos');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(tipoDeCurso: NewTipoDeCurso): Observable<EntityResponseType> {
    return this.http.post<ITipoDeCurso>(this.resourceUrl, tipoDeCurso, { observe: 'response' });
  }

  update(tipoDeCurso: ITipoDeCurso): Observable<EntityResponseType> {
    return this.http.put<ITipoDeCurso>(`${this.resourceUrl}/${this.getTipoDeCursoIdentifier(tipoDeCurso)}`, tipoDeCurso, {
      observe: 'response',
    });
  }

  partialUpdate(tipoDeCurso: PartialUpdateTipoDeCurso): Observable<EntityResponseType> {
    return this.http.patch<ITipoDeCurso>(`${this.resourceUrl}/${this.getTipoDeCursoIdentifier(tipoDeCurso)}`, tipoDeCurso, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoDeCurso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoDeCurso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTipoDeCursoIdentifier(tipoDeCurso: Pick<ITipoDeCurso, 'id'>): number {
    return tipoDeCurso.id;
  }

  compareTipoDeCurso(o1: Pick<ITipoDeCurso, 'id'> | null, o2: Pick<ITipoDeCurso, 'id'> | null): boolean {
    return o1 && o2 ? this.getTipoDeCursoIdentifier(o1) === this.getTipoDeCursoIdentifier(o2) : o1 === o2;
  }

  addTipoDeCursoToCollectionIfMissing<Type extends Pick<ITipoDeCurso, 'id'>>(
    tipoDeCursoCollection: Type[],
    ...tipoDeCursosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tipoDeCursos: Type[] = tipoDeCursosToCheck.filter(isPresent);
    if (tipoDeCursos.length > 0) {
      const tipoDeCursoCollectionIdentifiers = tipoDeCursoCollection.map(
        tipoDeCursoItem => this.getTipoDeCursoIdentifier(tipoDeCursoItem)!,
      );
      const tipoDeCursosToAdd = tipoDeCursos.filter(tipoDeCursoItem => {
        const tipoDeCursoIdentifier = this.getTipoDeCursoIdentifier(tipoDeCursoItem);
        if (tipoDeCursoCollectionIdentifiers.includes(tipoDeCursoIdentifier)) {
          return false;
        }
        tipoDeCursoCollectionIdentifiers.push(tipoDeCursoIdentifier);
        return true;
      });
      return [...tipoDeCursosToAdd, ...tipoDeCursoCollection];
    }
    return tipoDeCursoCollection;
  }
}
