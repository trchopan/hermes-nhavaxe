import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ArticlesService } from "@app/app/services/articles.service";

@Component({
  selector: "hm-articles-grid",
  templateUrl: "./articles-grid.component.html",
  styleUrls: ["./articles-grid.component.scss"]
})
export class ArticlesGridComponent implements OnInit {
  category: string;
  id: string;

  constructor(
    public articles: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.category = params.get("category")
      this.id = params.get("id")
    })
  }
}
