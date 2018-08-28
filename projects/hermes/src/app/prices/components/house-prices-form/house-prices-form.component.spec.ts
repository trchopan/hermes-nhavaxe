import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HousePricesFormComponent } from './house-prices-form.component';

describe('HousePricesFormComponent', () => {
  let component: HousePricesFormComponent;
  let fixture: ComponentFixture<HousePricesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HousePricesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HousePricesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
