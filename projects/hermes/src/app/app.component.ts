import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  ArticlesService,
  QueryAllCategories
} from "@app/app/services/articles.service";
import { ICategory } from "@editor/app/editor/models/category.model";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import {
  filter,
  map,
  distinctUntilChanged,
  debounceTime
} from "rxjs/operators";
import { combineLatest } from "rxjs";
import smoothscroll from "smoothscroll-polyfill";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  fixedMenu: boolean = false;
  categories: ICategory[];
  selectedCategory: ICategory = null;

  @ViewChild("head") headEl: ElementRef;

  constructor(public articles: ArticlesService, private router: Router) {
    smoothscroll.polyfill();
  }

  ngOnInit() {
    // Scroll to top when navigate to new route
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationStart),
        map(e => e as NavigationStart),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.headEl.nativeElement.scrollIntoView({ behavior: "smooth" });
      });

    // Resolve the routes and category selection
    combineLatest(
      this.articles.getCategories(),
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd),
        debounceTime(200)
      )
    ).subscribe(([categories, nav]) => {
      if (categories) {
        this.categories = categories;
        this.selectedCategory = categories.find(
          cat => cat.link === nav.url.slice(1)
        );
        let catId = this.selectedCategory
          ? this.selectedCategory.id
          : QueryAllCategories;
        this.articles.clearSelected();
        this.articles.loadByCategoryId(catId);
      }
    });

    // Set the menu to fix top when a acticle is selected
    this.articles.selectedMeta$.subscribe(meta => {
      if (meta === null) {
        return;
      }
      this.fixedMenu = true;
    });
  }

  scrollHandler(event: any) {
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;
    this.fixedMenu = scrollTop >= 82 ? true : false;

    if (scrollTop + offsetHeight >= scrollHeight * 0.9) {
      this.articles.loadMore();
    }
  }
}
