import { Component, Input, ViewEncapsulation, OnInit } from "@angular/core";
import { IArticle } from "@editor/app/editor/models/article.model";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  @Input() article: IArticle;

  safeYoutube: SafeHtml;

  constructor(private dom: DomSanitizer) {}

  ngOnInit() {
    if (this.article.video) {
      let html = `
      <iframe
        src="https://www.youtube.com/embed/${this.article.video}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
      `;
      this.safeYoutube = this.dom.bypassSecurityTrustHtml(html);
    }
  }
}
