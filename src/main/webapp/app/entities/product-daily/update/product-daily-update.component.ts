import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProductDaily, ProductDaily } from '../product-daily.model';
import { ProductDailyService } from '../service/product-daily.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ICity } from 'app/entities/city/city.model';
import { CityService } from 'app/entities/city/service/city.service';

@Component({
  selector: 'jhi-product-daily-update',
  templateUrl: './product-daily-update.component.html',
})
export class ProductDailyUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  citiesSharedCollection: ICity[] = [];

  editForm = this.fb.group({
    id: [],
    updatedDate: [null, [Validators.required]],
    value: [null, [Validators.required]],
    product: [null, Validators.required],
    city: [null, Validators.required],
  });

  constructor(
    protected productDailyService: ProductDailyService,
    protected productService: ProductService,
    protected cityService: CityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productDaily }) => {
      this.updateForm(productDaily);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productDaily = this.createFromForm();
    if (productDaily.id !== undefined) {
      this.subscribeToSaveResponse(this.productDailyService.update(productDaily));
    } else {
      this.subscribeToSaveResponse(this.productDailyService.create(productDaily));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackCityById(index: number, item: ICity): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductDaily>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productDaily: IProductDaily): void {
    this.editForm.patchValue({
      id: productDaily.id,
      updatedDate: productDaily.updatedDate,
      value: productDaily.value,
      product: productDaily.product,
      city: productDaily.city,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      productDaily.product
    );
    this.citiesSharedCollection = this.cityService.addCityToCollectionIfMissing(this.citiesSharedCollection, productDaily.city);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.cityService
      .query()
      .pipe(map((res: HttpResponse<ICity[]>) => res.body ?? []))
      .pipe(map((cities: ICity[]) => this.cityService.addCityToCollectionIfMissing(cities, this.editForm.get('city')!.value)))
      .subscribe((cities: ICity[]) => (this.citiesSharedCollection = cities));
  }

  protected createFromForm(): IProductDaily {
    return {
      ...new ProductDaily(),
      id: this.editForm.get(['id'])!.value,
      updatedDate: this.editForm.get(['updatedDate'])!.value,
      value: this.editForm.get(['value'])!.value,
      product: this.editForm.get(['product'])!.value,
      city: this.editForm.get(['city'])!.value,
    };
  }
}
