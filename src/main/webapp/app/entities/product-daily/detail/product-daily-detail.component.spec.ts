import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductDailyDetailComponent } from './product-daily-detail.component';

describe('Component Tests', () => {
  describe('ProductDaily Management Detail Component', () => {
    let comp: ProductDailyDetailComponent;
    let fixture: ComponentFixture<ProductDailyDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProductDailyDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ productDaily: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProductDailyDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductDailyDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load productDaily on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productDaily).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
