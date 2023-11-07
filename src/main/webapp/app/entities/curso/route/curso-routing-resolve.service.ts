import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICurso } from '../curso.model';
import { CursoService } from '../service/curso.service';

export const cursoResolve = (route: ActivatedRouteSnapshot): Observable<null | ICurso> => {
  const id = route.params['id'];
  if (id) {
    return inject(CursoService)
      .find(id)
      .pipe(
        mergeMap((curso: HttpResponse<ICurso>) => {
          if (curso.body) {
            return of(curso.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default cursoResolve;
