import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProductDaily, ProductDaily } from '../product-daily.model';

import { ProductDailyService } from './product-daily.service';

describe('Service Tests', () => {
  describe('ProductDaily Service', () => {
    let service: ProductDailyService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductDaily;
    let expectedResult: IProductDaily | IProductDaily[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductDailyService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        updatedDate: currentDate,
        value: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            updatedDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ProductDaily', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            updatedDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.create(new ProductDaily()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductDaily', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            updatedDate: currentDate.format(DATE_FORMAT),
            value: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProductDaily', () => {
        const patchObject = Object.assign(
          {
            updatedDate: currentDate.format(DATE_FORMAT),
          },
          new ProductDaily()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductDaily', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            updatedDate: currentDate.format(DATE_FORMAT),
            value: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            updatedDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ProductDaily', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProductDailyToCollectionIfMissing', () => {
        it('should add a ProductDaily to an empty array', () => {
          const productDaily: IProductDaily = { id: 123 };
          expectedResult = service.addProductDailyToCollectionIfMissing([], productDaily);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productDaily);
        });

        it('should not add a ProductDaily to an array that contains it', () => {
          const productDaily: IProductDaily = { id: 123 };
          const productDailyCollection: IProductDaily[] = [
            {
              ...productDaily,
            },
            { id: 456 },
          ];
          expectedResult = service.addProductDailyToCollectionIfMissing(productDailyCollection, productDaily);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProductDaily to an array that doesn't contain it", () => {
          const productDaily: IProductDaily = { id: 123 };
          const productDailyCollection: IProductDaily[] = [{ id: 456 }];
          expectedResult = service.addProductDailyToCollectionIfMissing(productDailyCollection, productDaily);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productDaily);
        });

        it('should add only unique ProductDaily to an array', () => {
          const productDailyArray: IProductDaily[] = [{ id: 123 }, { id: 456 }, { id: 65217 }];
          const productDailyCollection: IProductDaily[] = [{ id: 123 }];
          expectedResult = service.addProductDailyToCollectionIfMissing(productDailyCollection, ...productDailyArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const productDaily: IProductDaily = { id: 123 };
          const productDaily2: IProductDaily = { id: 456 };
          expectedResult = service.addProductDailyToCollectionIfMissing([], productDaily, productDaily2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productDaily);
          expect(expectedResult).toContain(productDaily2);
        });

        it('should accept null and undefined values', () => {
          const productDaily: IProductDaily = { id: 123 };
          expectedResult = service.addProductDailyToCollectionIfMissing([], null, productDaily, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productDaily);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
