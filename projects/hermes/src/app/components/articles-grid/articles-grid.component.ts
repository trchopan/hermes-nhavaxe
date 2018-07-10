import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";

@Component({
  selector: "hm-articles-grid",
  templateUrl: "./articles-grid.component.html",
  styleUrls: ["./articles-grid.component.scss"]
})
export class ArticlesGridComponent implements OnInit {
  constructor(public articles: ArticlesService) {}

  ngOnInit() {}
}
