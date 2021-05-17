import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductDailyComponent } from '../list/product-daily.component';
import { ProductDailyDetailComponent } from '../detail/product-daily-detail.component';
import { ProductDailyUpdateComponent } from '../update/product-daily-update.component';
import { ProductDailyRoutingResolveService } from './product-daily-routing-resolve.service';

const productDailyRoute: Routes = [
  {
    path: '',
    component: ProductDailyComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductDailyDetailComponent,
    resolve: {
      productDaily: ProductDailyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductDailyUpdateComponent,
    resolve: {
      productDaily: ProductDailyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductDailyUpdateComponent,
    resolve: {
      productDaily: ProductDailyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productDailyRoute)],
  exports: [RouterModule],
})
export class ProductDailyRoutingModule {}
