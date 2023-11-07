import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IModalidade } from '../modalidade.model';
import { ModalidadeService } from '../service/modalidade.service';

export const modalidadeResolve = (route: ActivatedRouteSnapshot): Observable<null | IModalidade> => {
  const id = route.params['id'];
  if (id) {
    return inject(ModalidadeService)
      .find(id)
      .pipe(
        mergeMap((modalidade: HttpResponse<IModalidade>) => {
          if (modalidade.body) {
            return of(modalidade.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default modalidadeResolve;
