import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMatriz } from '../matriz.model';
import { MatrizService } from '../service/matriz.service';

export const matrizResolve = (route: ActivatedRouteSnapshot): Observable<null | IMatriz> => {
  const id = route.params['id'];
  if (id) {
    return inject(MatrizService)
      .find(id)
      .pipe(
        mergeMap((matriz: HttpResponse<IMatriz>) => {
          if (matriz.body) {
            return of(matriz.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default matrizResolve;
