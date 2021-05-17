jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductDailyService } from '../service/product-daily.service';
import { IProductDaily, ProductDaily } from '../product-daily.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { ICity } from 'app/entities/city/city.model';
import { CityService } from 'app/entities/city/service/city.service';

import { ProductDailyUpdateComponent } from './product-daily-update.component';

describe('Component Tests', () => {
  describe('ProductDaily Management Update Component', () => {
    let comp: ProductDailyUpdateComponent;
    let fixture: ComponentFixture<ProductDailyUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productDailyService: ProductDailyService;
    let productService: ProductService;
    let cityService: CityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductDailyUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductDailyUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductDailyUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productDailyService = TestBed.inject(ProductDailyService);
      productService = TestBed.inject(ProductService);
      cityService = TestBed.inject(CityService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Product query and add missing value', () => {
        const productDaily: IProductDaily = { id: 456 };
        const product: IProduct = { id: 997 };
        productDaily.product = product;

        const productCollection: IProduct[] = [{ id: 62682 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [product];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call City query and add missing value', () => {
        const productDaily: IProductDaily = { id: 456 };
        const city: ICity = { id: 21149 };
        productDaily.city = city;

        const cityCollection: ICity[] = [{ id: 96086 }];
        spyOn(cityService, 'query').and.returnValue(of(new HttpResponse({ body: cityCollection })));
        const additionalCities = [city];
        const expectedCollection: ICity[] = [...additionalCities, ...cityCollection];
        spyOn(cityService, 'addCityToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        expect(cityService.query).toHaveBeenCalled();
        expect(cityService.addCityToCollectionIfMissing).toHaveBeenCalledWith(cityCollection, ...additionalCities);
        expect(comp.citiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const productDaily: IProductDaily = { id: 456 };
        const product: IProduct = { id: 53676 };
        productDaily.product = product;
        const city: ICity = { id: 71215 };
        productDaily.city = city;

        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(productDaily));
        expect(comp.productsSharedCollection).toContain(product);
        expect(comp.citiesSharedCollection).toContain(city);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productDaily = { id: 123 };
        spyOn(productDailyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productDaily }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productDailyService.update).toHaveBeenCalledWith(productDaily);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productDaily = new ProductDaily();
        spyOn(productDailyService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productDaily }));
        saveSubject.complete();

        // THEN
        expect(productDailyService.create).toHaveBeenCalledWith(productDaily);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productDaily = { id: 123 };
        spyOn(productDailyService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productDaily });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productDailyService.update).toHaveBeenCalledWith(productDaily);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProductById', () => {
        it('Should return tracked Product primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCityById', () => {
        it('Should return tracked City primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCityById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
