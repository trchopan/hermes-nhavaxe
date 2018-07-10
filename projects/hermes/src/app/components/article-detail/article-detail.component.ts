import { Component, OnInit, Input, ViewEncapsulation } from "@angular/core";
import {
  IArticle,
  IArticleBody
} from "@editor/app/editor/models/article.model";
import { ArticlesService } from "@app/app/services/articles.service";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "hm-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  @Input() meta: IArticle;
  @Input() body: IArticleBody;

  safeYoutube: SafeHtml;

  constructor(private dom: DomSanitizer, private articles: ArticlesService) {}

  ngOnInit() {
    if (this.meta && this.meta.video) {
      let html = `
      <iframe
        src="https://www.youtube.com/embed/${this.meta.video}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
      `;
      this.safeYoutube = this.dom.bypassSecurityTrustHtml(html);
    }
  }

  scrollHandler(event: any) {
    let scrollTop = event.target.scrollTop;
    let scrollHeight = event.target.scrollHeight;
    let offsetHeight = event.target.offsetHeight;
    if (scrollTop + offsetHeight >= scrollHeight) {
      this.articles.clearSelected();
    }
  }
}
