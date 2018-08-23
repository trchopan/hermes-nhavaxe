import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsEditComponent } from './fields-edit.component';

describe('FieldsEditComponent', () => {
  let component: FieldsEditComponent;
  let fixture: ComponentFixture<FieldsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
