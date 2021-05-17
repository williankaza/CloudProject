import * as dayjs from 'dayjs';
import { IProduct } from 'app/entities/product/product.model';
import { ICity } from 'app/entities/city/city.model';

export interface IProductDaily {
  id?: number;
  updatedDate?: dayjs.Dayjs;
  value?: number;
  product?: IProduct;
  city?: ICity;
}

export class ProductDaily implements IProductDaily {
  constructor(
    public id?: number,
    public updatedDate?: dayjs.Dayjs,
    public value?: number,
    public product?: IProduct,
    public city?: ICity
  ) {}
}

export function getProductDailyIdentifier(productDaily: IProductDaily): number | undefined {
  return productDaily.id;
}
