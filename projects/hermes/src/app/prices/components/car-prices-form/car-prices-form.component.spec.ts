import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPricesFormComponent } from './car-prices-form.component';

describe('CarPricesFormComponent', () => {
  let component: CarPricesFormComponent;
  let fixture: ComponentFixture<CarPricesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPricesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPricesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
