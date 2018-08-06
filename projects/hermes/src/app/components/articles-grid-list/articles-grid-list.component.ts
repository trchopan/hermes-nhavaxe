import { Component, Input, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";
import { IArticle } from "@editor/app/editor/models/article.model";
import {
  trigger,
  style,
  animate,
  transition,
  state
} from "@angular/animations";
import { LayoutService } from "@app/app/services/layout.service";

@Component({
  selector: "hm-articles-grid-list",
  templateUrl: "./articles-grid-list.component.html",
  styleUrls: ["./articles-grid-list.component.scss"],
  animations: [
    trigger("listState", [
      state(
        "show",
        style({
          opacity: 1,
          transform: "translateX(0)"
        })
      ),
      state(
        "hide",
        style({
          opacity: 0,
          transform: "translateX(-100vw)"
        })
      ),
      transition("hide => show", animate("200ms ease-in")),
      transition("show => hide", animate("200ms ease-in"))
    ])
  ]
})
export class ArticlesGridListComponent implements OnInit {
  @Input() list: IArticle[];

  currentCategoryId: string;
  titleMax: number = 70;
  sapoMax: number = 0;

  constructor(public articles: ArticlesService, public layout: LayoutService) {}

  ngOnInit() {
    // Set the max character for the triming pipe
    let clientWidth = this.layout.getViewWidth();
    if (clientWidth > 799) {
      this.titleMax = 999;
      this.sapoMax = 999;
      return;
    }
    if (clientWidth > 699) {
      this.titleMax = 120;
      this.sapoMax = 200;
      return;
    }
  }
}
