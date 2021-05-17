import { ICity } from 'app/entities/city/city.model';

export interface ICountry {
  id?: number;
  countryName?: string;
  countryNames?: ICity[] | null;
}

export class Country implements ICountry {
  constructor(public id?: number, public countryName?: string, public countryNames?: ICity[] | null) {}
}

export function getCountryIdentifier(country: ICountry): number | undefined {
  return country.id;
}
