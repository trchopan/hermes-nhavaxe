import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";
import { switchMap, map, debounceTime, share } from "rxjs/operators";
import { combineLatest, Observable } from "rxjs";
import { IArticle } from "@editor/app/editor/models/article.model";
import { environment } from "@app/environments/environment";

@Component({
  selector: "hm-articles-grid",
  templateUrl: "./articles-grid.component.html",
  styleUrls: ["./articles-grid.component.scss"]
})
export class ArticlesGridComponent implements OnInit {
  list$: Observable<IArticle[]>;
  tops$: Observable<IArticle[]>;
  remains$: Observable<IArticle[]>;
  cache: IArticle[];

  constructor(public articles: ArticlesService) {}

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
      }),
      share()
    );

    this.tops$ = this.list$.pipe(
      map(list => list.slice(0, environment.topAmount))
    );

    this.remains$ = this.list$.pipe(
      map(list => list.slice(environment.topAmount))
    );
  }
}
