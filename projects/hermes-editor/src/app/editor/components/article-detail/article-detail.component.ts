import { Component, Input, ViewEncapsulation, OnInit } from "@angular/core";
import { IArticle } from "@editor/app/editor/models/article.model";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { map } from "rxjs/operators";

@Component({
  selector: "article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  @Input() article: IArticle;

  safeYoutube: SafeHtml;
  body$: Observable<string>;

  constructor(private dom: DomSanitizer, private articles: ArticlesService) {}

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

    this.body$ = this.articles
      .getBodyData(this.article.id)
      .pipe(map(bodyData => (bodyData ? bodyData.body : "")));
  }
}
