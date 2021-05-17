import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductDaily } from '../product-daily.model';
import { ProductDailyService } from '../service/product-daily.service';
import { ProductDailyDeleteDialogComponent } from '../delete/product-daily-delete-dialog.component';

@Component({
  selector: 'jhi-product-daily',
  templateUrl: './product-daily.component.html',
})
export class ProductDailyComponent implements OnInit {
  productDailies?: IProductDaily[];
  isLoading = false;

  constructor(protected productDailyService: ProductDailyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.productDailyService.query().subscribe(
      (res: HttpResponse<IProductDaily[]>) => {
        this.isLoading = false;
        this.productDailies = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProductDaily): number {
    return item.id!;
  }

  delete(productDaily: IProductDaily): void {
    const modalRef = this.modalService.open(ProductDailyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productDaily = productDaily;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
