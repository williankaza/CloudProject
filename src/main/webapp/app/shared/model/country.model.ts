import { ICity } from 'app/shared/model/city.model';

export interface ICountry {
  id?: number;
  countryName?: string;
  countryNames?: ICity[];
}

export class Country implements ICountry {
  constructor(public id?: number, public countryName?: string, public countryNames?: ICity[]) {}
}
