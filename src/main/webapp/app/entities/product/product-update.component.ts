import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from './product.service';
import { IProductCategory } from 'app/shared/model/product-category.model';
import { ProductCategoryService } from 'app/entities/product-category/product-category.service';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city/city.service';

type SelectableEntity = IProductCategory | ICity;

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  productcategories: IProductCategory[] = [];
  cities: ICity[] = [];
  updatedDateDp: any;

  editForm = this.fb.group({
    id: [],
    productName: [],
    updatedDate: [],
    value: [],
    weight: [],
    category: [],
    city: [],
    productCategory: [],
    cities: [],
  });

  constructor(
    protected productService: ProductService,
    protected productCategoryService: ProductCategoryService,
    protected cityService: CityService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.productCategoryService.query().subscribe((res: HttpResponse<IProductCategory[]>) => (this.productcategories = res.body || []));

      this.cityService.query().subscribe((res: HttpResponse<ICity[]>) => (this.cities = res.body || []));
    });
  }

  updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      productName: product.productName,
      updatedDate: product.updatedDate,
      value: product.value,
      weight: product.weight,
      category: product.category,
      city: product.city,
      productCategory: product.productCategory,
      cities: product.cities,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  private createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      productName: this.editForm.get(['productName'])!.value,
      updatedDate: this.editForm.get(['updatedDate'])!.value,
      value: this.editForm.get(['value'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      category: this.editForm.get(['category'])!.value,
      city: this.editForm.get(['city'])!.value,
      productCategory: this.editForm.get(['productCategory'])!.value,
      cities: this.editForm.get(['cities'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: ICity[], option: ICity): ICity {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
