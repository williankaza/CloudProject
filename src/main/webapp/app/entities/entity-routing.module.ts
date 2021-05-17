import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: { pageTitle: 'hybridCloudApp.country.home.title' },
        loadChildren: () => import('./country/country.module').then(m => m.CountryModule),
      },
      {
        path: 'city',
        data: { pageTitle: 'hybridCloudApp.city.home.title' },
        loadChildren: () => import('./city/city.module').then(m => m.CityModule),
      },
      {
        path: 'product',
        data: { pageTitle: 'hybridCloudApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'product-category',
        data: { pageTitle: 'hybridCloudApp.productCategory.home.title' },
        loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryModule),
      },
      {
        path: 'product-daily',
        data: { pageTitle: 'hybridCloudApp.productDaily.home.title' },
        loadChildren: () => import('./product-daily/product-daily.module').then(m => m.ProductDailyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
