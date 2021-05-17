jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CityService } from '../service/city.service';
import { ICity, City } from '../city.model';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';

import { CityUpdateComponent } from './city-update.component';

describe('Component Tests', () => {
  describe('City Management Update Component', () => {
    let comp: CityUpdateComponent;
    let fixture: ComponentFixture<CityUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cityService: CityService;
    let countryService: CountryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CityUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CityUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cityService = TestBed.inject(CityService);
      countryService = TestBed.inject(CountryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Country query and add missing value', () => {
        const city: ICity = { id: 456 };
        const country: ICountry = { id: 45185 };
        city.country = country;

        const countryCollection: ICountry[] = [{ id: 82050 }];
        spyOn(countryService, 'query').and.returnValue(of(new HttpResponse({ body: countryCollection })));
        const additionalCountries = [country];
        const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
        spyOn(countryService, 'addCountryToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ city });
        comp.ngOnInit();

        expect(countryService.query).toHaveBeenCalled();
        expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(countryCollection, ...additionalCountries);
        expect(comp.countriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const city: ICity = { id: 456 };
        const country: ICountry = { id: 5164 };
        city.country = country;

        activatedRoute.data = of({ city });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(city));
        expect(comp.countriesSharedCollection).toContain(country);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const city = { id: 123 };
        spyOn(cityService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ city });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: city }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cityService.update).toHaveBeenCalledWith(city);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const city = new City();
        spyOn(cityService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ city });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: city }));
        saveSubject.complete();

        // THEN
        expect(cityService.create).toHaveBeenCalledWith(city);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const city = { id: 123 };
        spyOn(cityService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ city });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cityService.update).toHaveBeenCalledWith(city);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCountryById', () => {
        it('Should return tracked Country primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCountryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
