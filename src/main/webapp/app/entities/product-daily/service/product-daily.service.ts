import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductDaily, getProductDailyIdentifier } from '../product-daily.model';

export type EntityResponseType = HttpResponse<IProductDaily>;
export type EntityArrayResponseType = HttpResponse<IProductDaily[]>;

@Injectable({ providedIn: 'root' })
export class ProductDailyService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/product-dailies');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(productDaily: IProductDaily): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDaily);
    return this.http
      .post<IProductDaily>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(productDaily: IProductDaily): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDaily);
    return this.http
      .put<IProductDaily>(`${this.resourceUrl}/${getProductDailyIdentifier(productDaily) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(productDaily: IProductDaily): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(productDaily);
    return this.http
      .patch<IProductDaily>(`${this.resourceUrl}/${getProductDailyIdentifier(productDaily) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProductDaily>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProductDaily[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductDailyToCollectionIfMissing(
    productDailyCollection: IProductDaily[],
    ...productDailiesToCheck: (IProductDaily | null | undefined)[]
  ): IProductDaily[] {
    const productDailies: IProductDaily[] = productDailiesToCheck.filter(isPresent);
    if (productDailies.length > 0) {
      const productDailyCollectionIdentifiers = productDailyCollection.map(
        productDailyItem => getProductDailyIdentifier(productDailyItem)!
      );
      const productDailiesToAdd = productDailies.filter(productDailyItem => {
        const productDailyIdentifier = getProductDailyIdentifier(productDailyItem);
        if (productDailyIdentifier == null || productDailyCollectionIdentifiers.includes(productDailyIdentifier)) {
          return false;
        }
        productDailyCollectionIdentifiers.push(productDailyIdentifier);
        return true;
      });
      return [...productDailiesToAdd, ...productDailyCollection];
    }
    return productDailyCollection;
  }

  protected convertDateFromClient(productDaily: IProductDaily): IProductDaily {
    return Object.assign({}, productDaily, {
      updatedDate: productDaily.updatedDate?.isValid() ? productDaily.updatedDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.updatedDate = res.body.updatedDate ? dayjs(res.body.updatedDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((productDaily: IProductDaily) => {
        productDaily.updatedDate = productDaily.updatedDate ? dayjs(productDaily.updatedDate) : undefined;
      });
    }
    return res;
  }
}
