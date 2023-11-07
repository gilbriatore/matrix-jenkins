import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoDeCurso } from '../tipo-de-curso.model';
import { TipoDeCursoService } from '../service/tipo-de-curso.service';

export const tipoDeCursoResolve = (route: ActivatedRouteSnapshot): Observable<null | ITipoDeCurso> => {
  const id = route.params['id'];
  if (id) {
    return inject(TipoDeCursoService)
      .find(id)
      .pipe(
        mergeMap((tipoDeCurso: HttpResponse<ITipoDeCurso>) => {
          if (tipoDeCurso.body) {
            return of(tipoDeCurso.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default tipoDeCursoResolve;
