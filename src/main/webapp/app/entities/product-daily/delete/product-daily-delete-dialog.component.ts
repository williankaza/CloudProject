import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductDaily } from '../product-daily.model';
import { ProductDailyService } from '../service/product-daily.service';

@Component({
  templateUrl: './product-daily-delete-dialog.component.html',
})
export class ProductDailyDeleteDialogComponent {
  productDaily?: IProductDaily;

  constructor(protected productDailyService: ProductDailyService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productDailyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
