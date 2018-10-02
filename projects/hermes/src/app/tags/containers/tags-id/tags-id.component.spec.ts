import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsIdComponent } from './tags-id.component';

describe('TagsIdComponent', () => {
  let component: TagsIdComponent;
  let fixture: ComponentFixture<TagsIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
