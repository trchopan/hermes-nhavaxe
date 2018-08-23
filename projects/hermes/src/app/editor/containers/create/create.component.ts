import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { IArticle } from "@app/app/editor/models/article.model";

@Component({
  selector: "hm-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  constructor(public articles: ArticlesService) {}

  ngOnInit() {
    this.articles.clearError();
  }

  handleCreate(article: IArticle) {
    this.articles.create(article);
  }
}
