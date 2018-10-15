import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VidoesListComponent } from './vidoes-list.component';

describe('VidoesListComponent', () => {
  let component: VidoesListComponent;
  let fixture: ComponentFixture<VidoesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VidoesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VidoesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
