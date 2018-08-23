import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceItemFormComponent } from './price-item-form.component';

describe('PriceItemFormComponent', () => {
  let component: PriceItemFormComponent;
  let fixture: ComponentFixture<PriceItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceItemFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
