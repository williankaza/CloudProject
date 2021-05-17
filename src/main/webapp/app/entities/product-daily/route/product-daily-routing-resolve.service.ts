import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductDaily, ProductDaily } from '../product-daily.model';
import { ProductDailyService } from '../service/product-daily.service';

@Injectable({ providedIn: 'root' })
export class ProductDailyRoutingResolveService implements Resolve<IProductDaily> {
  constructor(protected service: ProductDailyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductDaily> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productDaily: HttpResponse<ProductDaily>) => {
          if (productDaily.body) {
            return of(productDaily.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductDaily());
  }
}
