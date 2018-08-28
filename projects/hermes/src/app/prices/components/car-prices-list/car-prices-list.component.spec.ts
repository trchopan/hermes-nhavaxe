import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPricesListComponent } from './car-prices-list.component';

describe('CarPricesListComponent', () => {
  let component: CarPricesListComponent;
  let fixture: ComponentFixture<CarPricesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPricesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPricesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
