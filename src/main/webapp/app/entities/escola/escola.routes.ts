import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EscolaComponent } from './list/escola.component';
import { EscolaDetailComponent } from './detail/escola-detail.component';
import { EscolaUpdateComponent } from './update/escola-update.component';
import EscolaResolve from './route/escola-routing-resolve.service';

const escolaRoute: Routes = [
  {
    path: '',
    component: EscolaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EscolaDetailComponent,
    resolve: {
      escola: EscolaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EscolaUpdateComponent,
    resolve: {
      escola: EscolaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EscolaUpdateComponent,
    resolve: {
      escola: EscolaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default escolaRoute;
