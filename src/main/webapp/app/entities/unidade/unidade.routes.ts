import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UnidadeComponent } from './list/unidade.component';
import { UnidadeDetailComponent } from './detail/unidade-detail.component';
import { UnidadeUpdateComponent } from './update/unidade-update.component';
import UnidadeResolve from './route/unidade-routing-resolve.service';

const unidadeRoute: Routes = [
  {
    path: '',
    component: UnidadeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UnidadeDetailComponent,
    resolve: {
      unidade: UnidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UnidadeUpdateComponent,
    resolve: {
      unidade: UnidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UnidadeUpdateComponent,
    resolve: {
      unidade: UnidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default unidadeRoute;
