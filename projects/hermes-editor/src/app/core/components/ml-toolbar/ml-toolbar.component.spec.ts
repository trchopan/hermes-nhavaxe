import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlToolbarComponent } from './ml-toolbar.component';

describe('MlToolbarComponent', () => {
  let component: MlToolbarComponent;
  let fixture: ComponentFixture<MlToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
