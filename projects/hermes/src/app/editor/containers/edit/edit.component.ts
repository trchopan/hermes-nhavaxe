import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { ActivatedRoute } from "@angular/router";
import { IArticle } from "@app/app/editor/models/article.model";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.layout.clearError();
    this.article$ = this.route.paramMap.pipe(
      switchMap(param => this.articles.getArticleData(param.get("id")))
    );
  }

  handleUpdate(article: IArticle) {
    this.articles.update(article);
  }
}
