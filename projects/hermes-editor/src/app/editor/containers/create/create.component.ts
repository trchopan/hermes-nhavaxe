import { Component, OnInit } from "@angular/core";
import { UserService } from "@editor/app/auth/services/user.service";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { IArticle } from "@editor/app/editor/models/article.model";

@Component({
  selector: "hm-editor-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  constructor(public user: UserService, public articles: ArticlesService) {}

  ngOnInit() {
    this.articles.clearError();
  }

  handleCreate(article: IArticle) {
    this.articles.create(article);
  }
}
