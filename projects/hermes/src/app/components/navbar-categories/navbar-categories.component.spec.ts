import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCategoriesComponent } from '@app/app/components/navbar-categories/navbar-categories.component';

describe('NavbarCategoriesComponent', () => {
  let component: NavbarCategoriesComponent;
  let fixture: ComponentFixture<NavbarCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
