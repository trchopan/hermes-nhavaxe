import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { IArticle } from "@app/app/editor/models/article.model";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  constructor(public articles: ArticlesService, public layout: LayoutService) {}

  ngOnInit() {
    this.layout.clearError();
  }

  handleCreate(article: IArticle) {
    this.articles.create(article);
  }
}
