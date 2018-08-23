import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import {
  IArticle,
  IArticleBody
} from "@app/app/editor/models/article.model";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { tap, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit {
  meta$: Observable<IArticle>;
  bodyList$: Observable<IArticleBody[]>;
  safeYoutube: SafeHtml;
  selectedBodyIndex: number = 0;

  constructor(
    public layout: LayoutService,
    private dom: DomSanitizer,
    private articles: ArticlesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log("Article Detail init");

    this.route.paramMap.subscribe(params => {
      let id = params.get("id");
      if (!id) {
        this.layout.showArticle = false;
        this.meta$ = null;
        this.bodyList$ = null;
        this.safeYoutube = null;
        return;
      }
      this.layout.showArticle = true;
      this.meta$ = this.articles.getArticleData(id).pipe(
        tap(meta => {
          if (meta && meta.video) {
            let video = this.youtube_parser(meta.video);
            let html = `
              <iframe
                src="https://www.youtube.com/embed/${video}"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
              `;
            this.safeYoutube = this.dom.bypassSecurityTrustHtml(html);
          }
        })
      );
      this.bodyList$ = this.articles
        .getBodyData(id)
        .pipe(
          map(
            (articles: IArticleBody[]) =>
              articles && articles.length > 0 ? articles : null
          )
        );
    });
  }

  youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
}
