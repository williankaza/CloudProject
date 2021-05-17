import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductDailyService } from '../service/product-daily.service';

import { ProductDailyComponent } from './product-daily.component';

describe('Component Tests', () => {
  describe('ProductDaily Management Component', () => {
    let comp: ProductDailyComponent;
    let fixture: ComponentFixture<ProductDailyComponent>;
    let service: ProductDailyService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductDailyComponent],
      })
        .overrideTemplate(ProductDailyComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductDailyComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProductDailyService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.productDailies?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
