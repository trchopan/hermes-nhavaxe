import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HousePricesListComponent } from './house-prices-list.component';

describe('HousePricesListComponent', () => {
  let component: HousePricesListComponent;
  let fixture: ComponentFixture<HousePricesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousePricesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HousePricesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
