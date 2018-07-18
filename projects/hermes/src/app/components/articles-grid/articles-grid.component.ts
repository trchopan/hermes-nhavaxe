import { Component, OnInit } from "@angular/core";
import {
  ArticlesService,
  HomeCategories
} from "@app/app/services/articles.service";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap, map, debounceTime } from "rxjs/operators";
import { of, combineLatest, Observable } from "rxjs";
import { LayoutService } from "@app/app/services/layout.service";
import { IArticle } from "@editor/app/editor/models/article.model";
import { ICategory } from "@editor/app/editor/models/category.model";

@Component({
  selector: "hm-articles-grid",
  templateUrl: "./articles-grid.component.html",
  styleUrls: ["./articles-grid.component.scss"]
})
export class ArticlesGridComponent implements OnInit {
  list$: Observable<IArticle[]>;
  cache: IArticle[];

  constructor(
    public layout: LayoutService,
    public articles: ArticlesService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("Articles Grid Init");

    // Clear cache when category change
    this.articles.selectedCat$.subscribe(() => (this.cache = []));

    this.list$ = combineLatest(
      this.articles.selectedCat$,
      this.articles.lastStartAtCursor$
    ).pipe(
      debounceTime(100),
      switchMap(([category, lastStartAt]) => {
        return this.articles.getCategoryArticles(
          category.id,
          lastStartAt || Date.now()
        );
      }),
      map(articles => {
        if (articles && articles.length > 0) {
          this.cache = this.cache.concat(articles);
        }
        return this.cache;
      })
    );
  }

  select(article: IArticle) {
    this.router.navigate(["article", article.id]);
  }
}
