import { Component, Input } from "@angular/core";
import { IArticle } from "@editor/app/editor/models/article.model";

@Component({
  selector: "hm-articles-grid-list",
  templateUrl: "./articles-grid-list.component.html",
  styleUrls: ["./articles-grid-list.component.scss"]
})
export class ArticlesGridListComponent {
  @Input() list: IArticle[];
}
