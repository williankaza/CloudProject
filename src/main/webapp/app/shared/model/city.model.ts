import { ICountry } from 'app/shared/model/country.model';
import { IProduct } from 'app/shared/model/product.model';

export interface ICity {
  id?: number;
  cityName?: string;
  country?: ICountry;
  products?: IProduct[];
}

export class City implements ICity {
  constructor(public id?: number, public cityName?: string, public country?: ICountry, public products?: IProduct[]) {}
}
