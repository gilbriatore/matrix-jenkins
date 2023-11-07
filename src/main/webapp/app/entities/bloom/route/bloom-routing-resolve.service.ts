import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBloom } from '../bloom.model';
import { BloomService } from '../service/bloom.service';

export const bloomResolve = (route: ActivatedRouteSnapshot): Observable<null | IBloom> => {
  const id = route.params['id'];
  if (id) {
    return inject(BloomService)
      .find(id)
      .pipe(
        mergeMap((bloom: HttpResponse<IBloom>) => {
          if (bloom.body) {
            return of(bloom.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default bloomResolve;
