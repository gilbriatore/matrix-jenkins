import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAtividade } from '../atividade.model';
import { AtividadeService } from '../service/atividade.service';

export const atividadeResolve = (route: ActivatedRouteSnapshot): Observable<null | IAtividade> => {
  const id = route.params['id'];
  if (id) {
    return inject(AtividadeService)
      .find(id)
      .pipe(
        mergeMap((atividade: HttpResponse<IAtividade>) => {
          if (atividade.body) {
            return of(atividade.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default atividadeResolve;
