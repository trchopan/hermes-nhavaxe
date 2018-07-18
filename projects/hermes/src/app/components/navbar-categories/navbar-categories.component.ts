import { Component } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";
import { LayoutService } from "@app/app/services/layout.service";
import { Router } from "@angular/router";
import { ICategory } from "@editor/app/editor/models/category.model";

@Component({
  selector: "hm-navbar-categories",
  templateUrl: "./navbar-categories.component.html",
  styleUrls: ["./navbar-categories.component.scss"]
})
export class NavbarCategoriesComponent {
  constructor(
    public layout: LayoutService,
    public articles: ArticlesService,
    private router: Router
  ) {}

  selectCategory(category: ICategory) {
    this.layout.scrollTop();
    this.layout.fixedNav = false;
    this.layout.showArticle = false;
    this.articles.selectedCat$.next(category);
    this.articles.lastStartAtCursor$.next(null);
    this.router.navigate(["article"]);
  }
}
