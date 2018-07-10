import { Component, Input } from "@angular/core";
import { IArticle } from "@editor/app/editor/models/article.model";
import { ArticlesService } from "@app/app/services/articles.service";

@Component({
  selector: "hm-articles-grid-top",
  templateUrl: "./articles-grid-top.component.html",
  styleUrls: ["./articles-grid-top.component.scss"]
})
export class ArticlesGridTopComponent {
  @Input() list: IArticle[];
  constructor(public articles: ArticlesService) {}
}
