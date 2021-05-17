jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductDaily, ProductDaily } from '../product-daily.model';
import { ProductDailyService } from '../service/product-daily.service';

import { ProductDailyRoutingResolveService } from './product-daily-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProductDaily routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProductDailyRoutingResolveService;
    let service: ProductDailyService;
    let resultProductDaily: IProductDaily | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProductDailyRoutingResolveService);
      service = TestBed.inject(ProductDailyService);
      resultProductDaily = undefined;
    });

    describe('resolve', () => {
      it('should return IProductDaily returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductDaily = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductDaily).toEqual({ id: 123 });
      });

      it('should return new IProductDaily if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductDaily = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProductDaily).toEqual(new ProductDaily());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductDaily = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductDaily).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
