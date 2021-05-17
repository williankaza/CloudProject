import { IProduct } from 'app/entities/product/product.model';

export interface IProductCategory {
  id?: number;
  categoryName?: string;
  categoryNames?: IProduct[] | null;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public categoryName?: string, public categoryNames?: IProduct[] | null) {}
}

export function getProductCategoryIdentifier(productCategory: IProductCategory): number | undefined {
  return productCategory.id;
}
