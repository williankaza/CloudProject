import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProductDailyComponent } from './list/product-daily.component';
import { ProductDailyDetailComponent } from './detail/product-daily-detail.component';
import { ProductDailyUpdateComponent } from './update/product-daily-update.component';
import { ProductDailyDeleteDialogComponent } from './delete/product-daily-delete-dialog.component';
import { ProductDailyRoutingModule } from './route/product-daily-routing.module';

@NgModule({
  imports: [SharedModule, ProductDailyRoutingModule],
  declarations: [ProductDailyComponent, ProductDailyDetailComponent, ProductDailyUpdateComponent, ProductDailyDeleteDialogComponent],
  entryComponents: [ProductDailyDeleteDialogComponent],
})
export class ProductDailyModule {}
