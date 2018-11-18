import { Component, Input } from "@angular/core";
import { IArticle } from "@app/app/editor/models/article.model";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { Router } from "@angular/router";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "article-list",
  templateUrl: "./article-list.component.html",
  styleUrls: ["./article-list.component.scss"]
})
export class ArticleListComponent {
  @Input() list: IArticle[];

  constructor(
    private articles: ArticlesService,
    private router: Router,
    private layout: LayoutService
  ) {}

  edit(article: IArticle) {
    if (this.articles.isEditable(article.status)) {
      this.router.navigate(["article/edit", article.id]);
    } else {
      console.log("[Articles] locked", article);
      this.layout.snackWarning("Bài đã bị khoá");
    }
  }

  preview(article: IArticle) {
    this.router.navigate(["article/preview", article.id]);
  }

  openExternal(article: IArticle) {
    window.open("https://nhavaxe.vn/article/" + article.id, "_blank");
  }
}
