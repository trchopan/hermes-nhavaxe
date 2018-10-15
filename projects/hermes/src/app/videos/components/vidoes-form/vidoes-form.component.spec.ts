import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidoesFormComponent } from './vidoes-form.component';

describe('VidoesFormComponent', () => {
  let component: VidoesFormComponent;
  let fixture: ComponentFixture<VidoesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VidoesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VidoesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
