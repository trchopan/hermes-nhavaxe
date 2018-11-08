import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackWarningComponent } from './snack-warning.component';

describe('SnackWarningComponent', () => {
  let component: SnackWarningComponent;
  let fixture: ComponentFixture<SnackWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
