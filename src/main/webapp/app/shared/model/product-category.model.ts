import { IProduct } from 'app/shared/model/product.model';

export interface IProductCategory {
  id?: number;
  categoryName?: string;
  products?: IProduct[];
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public categoryName?: string, public products?: IProduct[]) {}
}
