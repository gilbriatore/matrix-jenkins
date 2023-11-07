import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BloomComponent } from './list/bloom.component';
import { BloomDetailComponent } from './detail/bloom-detail.component';
import { BloomUpdateComponent } from './update/bloom-update.component';
import BloomResolve from './route/bloom-routing-resolve.service';

const bloomRoute: Routes = [
  {
    path: '',
    component: BloomComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloomDetailComponent,
    resolve: {
      bloom: BloomResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloomUpdateComponent,
    resolve: {
      bloom: BloomResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloomUpdateComponent,
    resolve: {
      bloom: BloomResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bloomRoute;
