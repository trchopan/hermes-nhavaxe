import { Component, Input } from "@angular/core";
import { IArticle } from "@app/app/editor/models/article.model";

@Component({
  selector: "hm-tag-results",
  templateUrl: "./tag-results.component.html",
  styleUrls: ["./tag-results.component.scss"]
})
export class TagResultsComponent {
  @Input()
  list: { article: IArticle; relevant: number }[];

  constructor() {}
}
