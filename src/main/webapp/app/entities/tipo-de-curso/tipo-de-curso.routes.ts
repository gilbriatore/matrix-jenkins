import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TipoDeCursoComponent } from './list/tipo-de-curso.component';
import { TipoDeCursoDetailComponent } from './detail/tipo-de-curso-detail.component';
import { TipoDeCursoUpdateComponent } from './update/tipo-de-curso-update.component';
import TipoDeCursoResolve from './route/tipo-de-curso-routing-resolve.service';

const tipoDeCursoRoute: Routes = [
  {
    path: '',
    component: TipoDeCursoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TipoDeCursoDetailComponent,
    resolve: {
      tipoDeCurso: TipoDeCursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TipoDeCursoUpdateComponent,
    resolve: {
      tipoDeCurso: TipoDeCursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TipoDeCursoUpdateComponent,
    resolve: {
      tipoDeCurso: TipoDeCursoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tipoDeCursoRoute;
