import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ModalidadeComponent } from './list/modalidade.component';
import { ModalidadeDetailComponent } from './detail/modalidade-detail.component';
import { ModalidadeUpdateComponent } from './update/modalidade-update.component';
import ModalidadeResolve from './route/modalidade-routing-resolve.service';

const modalidadeRoute: Routes = [
  {
    path: '',
    component: ModalidadeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ModalidadeDetailComponent,
    resolve: {
      modalidade: ModalidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ModalidadeUpdateComponent,
    resolve: {
      modalidade: ModalidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ModalidadeUpdateComponent,
    resolve: {
      modalidade: ModalidadeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default modalidadeRoute;
