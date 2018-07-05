import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";
import { ICategory } from "@editor/app/editor/models/category.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  fixedMenu: boolean = false;
  categories: ICategory[];
  categoryCursor: number = 0;

  constructor(public articles: ArticlesService) {}

  ngOnInit() {
    this.articles.categoriesList$.subscribe(catList => {
      this.categories = catList;
    });
  }

  scrollHandler(event: Event) {
    this.fixedMenu = event.srcElement.scrollTop >= 84 ? true : false;
  }

  liClicked(clickedCat) {
    this.categories = this.categories.map(category => {
      if (category.name === clickedCat.name) {
        return { id: "selected", name: category.name, link: category.link };
      }
      return { id: "", name: category.name, link: category.link };
    });
  }
}
