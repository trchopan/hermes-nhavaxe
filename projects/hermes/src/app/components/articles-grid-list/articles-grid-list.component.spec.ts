import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesGridListComponent } from './articles-grid-list.component';

describe('ArticlesGridListComponent', () => {
  let component: ArticlesGridListComponent;
  let fixture: ComponentFixture<ArticlesGridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesGridListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
