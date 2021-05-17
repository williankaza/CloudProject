import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductDaily } from '../product-daily.model';

@Component({
  selector: 'jhi-product-daily-detail',
  templateUrl: './product-daily-detail.component.html',
})
export class ProductDailyDetailComponent implements OnInit {
  productDaily: IProductDaily | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productDaily }) => {
      this.productDaily = productDaily;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
