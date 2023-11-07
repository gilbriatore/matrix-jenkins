import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AtividadeComponent } from './list/atividade.component';
import { AtividadeDetailComponent } from './detail/atividade-detail.component';
import { AtividadeUpdateComponent } from './update/atividade-update.component';
import AtividadeResolve from './route/atividade-routing-resolve.service';

const atividadeRoute: Routes = [
  {
    path: '',
    component: AtividadeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AtividadeDetailComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AtividadeUpdateComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AtividadeUpdateComponent,
    resolve: {
      atividade: AtividadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default atividadeRoute;
