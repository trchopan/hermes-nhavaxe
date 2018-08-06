import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from "@angular/core";
import smoothscroll from "smoothscroll-polyfill";
import { LayoutService } from "@app/app/services/layout.service";
import { ArticlesService } from "@app/app/services/articles.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("head") headEl: ElementRef;

  constructor(
    private layout: LayoutService,
    private articles: ArticlesService
  ) {
    smoothscroll.polyfill();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.layout.headEl = this.headEl;
  }

  scrollHandler(event: any) {
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let clientHeight = event.target.clientHeight;

    if (scrollTop >= scrollHeight - clientHeight - 100) {
      this.articles.loadMore();
    }
  }
}
