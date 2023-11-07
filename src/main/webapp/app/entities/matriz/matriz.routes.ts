import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MatrizComponent } from './list/matriz.component';
import { MatrizDetailComponent } from './detail/matriz-detail.component';
import { MatrizUpdateComponent } from './update/matriz-update.component';
import MatrizResolve from './route/matriz-routing-resolve.service';

const matrizRoute: Routes = [
  {
    path: '',
    component: MatrizComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MatrizDetailComponent,
    resolve: {
      matriz: MatrizResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MatrizUpdateComponent,
    resolve: {
      matriz: MatrizResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MatrizUpdateComponent,
    resolve: {
      matriz: MatrizResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default matrizRoute;
