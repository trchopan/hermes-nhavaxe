import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IArticle } from "@app/app/editor/models/article.model";
import { Observable, of } from "rxjs";
import { switchMap, withLatestFrom } from "rxjs/operators";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  article$: Observable<IArticle>;

  constructor(
    public articles: ArticlesService,
    public layout: LayoutService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.layout.clearError();
    this.article$ = this.route.paramMap.pipe(
      withLatestFrom(this.articles.list$),
      switchMap(([param, list]) => {
        let found =
          list && list.length > 0
            ? list.find(x => x.id === param.get("id"))
            : null;
        if (found) {
          return of(found);
        }
        return this.articles.getArticleData(param.get("id"));
      })
    );
  }

  async handleUpdate(article: IArticle) {
    if (await this.articles.update(article)) {
      this.router.navigate(["/article/list"]);
    }
  }
}
