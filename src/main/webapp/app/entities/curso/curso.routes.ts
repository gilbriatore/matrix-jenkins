import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CursoComponent } from './list/curso.component';
import { CursoDetailComponent } from './detail/curso-detail.component';
import { CursoUpdateComponent } from './update/curso-update.component';
import CursoResolve from './route/curso-routing-resolve.service';

const cursoRoute: Routes = [
  {
    path: '',
    component: CursoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CursoDetailComponent,
    resolve: {
      curso: CursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CursoUpdateComponent,
    resolve: {
      curso: CursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CursoUpdateComponent,
    resolve: {
      curso: CursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cursoRoute;
