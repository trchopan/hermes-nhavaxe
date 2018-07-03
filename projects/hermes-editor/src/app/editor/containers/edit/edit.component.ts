import { Component, OnInit } from "@angular/core";
import { UserService } from "@editor/app/auth/services/user.service";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { Router, ActivatedRoute } from "@angular/router";
import { IArticle } from "@editor/app/editor/models/article.model";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "hm-editor-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  article$: Observable<IArticle>;

  constructor(
    public user: UserService,
    public articles: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.articles.clearError();
    this.article$ = combineLatest(
      this.articles.list$,
      this.route.paramMap
    ).pipe(
      map(([articles, params]) =>
        articles.find(article => article.id === params.get("id"))
      )
    );
  }

  handleUpdate(article: IArticle) {
    this.articles.update(article);
  }
}
