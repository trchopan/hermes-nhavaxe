import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesGridTopComponent } from '@app/app/components/articles-grid-top/articles-grid-top.component';

describe('ArticlesGridTopComponent', () => {
  let component: ArticlesGridTopComponent;
  let fixture: ComponentFixture<ArticlesGridTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesGridTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesGridTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
