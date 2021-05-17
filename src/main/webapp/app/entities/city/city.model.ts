import { ICountry } from 'app/entities/country/country.model';
import { IProductDaily } from 'app/entities/product-daily/product-daily.model';

export interface ICity {
  id?: number;
  cityName?: string;
  country?: ICountry;
  cityNames?: IProductDaily[] | null;
}

export class City implements ICity {
  constructor(public id?: number, public cityName?: string, public country?: ICountry, public cityNames?: IProductDaily[] | null) {}
}

export function getCityIdentifier(city: ICity): number | undefined {
  return city.id;
}
