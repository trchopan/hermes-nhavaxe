import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishAtLabelComponent } from '@app/app/shared/components/publish-at-label/publish-at-label.component';

describe('PublishAtLabelComponent', () => {
  let component: PublishAtLabelComponent;
  let fixture: ComponentFixture<PublishAtLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishAtLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishAtLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
