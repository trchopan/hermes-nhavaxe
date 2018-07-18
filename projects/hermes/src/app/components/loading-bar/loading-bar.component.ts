import { Component } from "@angular/core";
import { ArticlesService } from "@app/app/services/articles.service";

@Component({
  selector: "hm-loading-bar",
  templateUrl: "./loading-bar.component.html",
  styleUrls: ["./loading-bar.component.scss"]
})
export class LoadingBarComponent {
  constructor(public articles: ArticlesService) {}
}
