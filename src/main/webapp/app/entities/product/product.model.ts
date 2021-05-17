import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { IProductDaily } from 'app/entities/product-daily/product-daily.model';

export interface IProduct {
  id?: number;
  productName?: string;
  weight?: number | null;
  category?: IProductCategory;
  productNames?: IProductDaily[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productName?: string,
    public weight?: number | null,
    public category?: IProductCategory,
    public productNames?: IProductDaily[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
