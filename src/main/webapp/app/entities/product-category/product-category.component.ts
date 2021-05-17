import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductCategory } from 'app/shared/model/product-category.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryDeleteDialogComponent } from './product-category-delete-dialog.component';

@Component({
  selector: 'jhi-product-category',
  templateUrl: './product-category.component.html',
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  productCategories: IProductCategory[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected productCategoryService: ProductCategoryService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.productCategories = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.productCategoryService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IProductCategory[]>) => this.paginateProductCategories(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.productCategories = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInProductCategories();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IProductCategory): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInProductCategories(): void {
    this.eventSubscriber = this.eventManager.subscribe('productCategoryListModification', () => this.reset());
  }

  delete(productCategory: IProductCategory): void {
    const modalRef = this.modalService.open(ProductCategoryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productCategory = productCategory;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateProductCategories(data: IProductCategory[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.productCategories.push(data[i]);
      }
    }
  }
}
