import { Moment } from 'moment';
import { IProductCategory } from 'app/shared/model/product-category.model';
import { ICity } from 'app/shared/model/city.model';

export interface IProduct {
  id?: number;
  productName?: string;
  updatedDate?: Moment;
  value?: number;
  weight?: number;
  category?: string;
  city?: string;
  productCategory?: IProductCategory;
  cities?: ICity[];
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productName?: string,
    public updatedDate?: Moment,
    public value?: number,
    public weight?: number,
    public category?: string,
    public city?: string,
    public productCategory?: IProductCategory,
    public cities?: ICity[]
  ) {}
}
