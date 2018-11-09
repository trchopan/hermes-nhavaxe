import { Component, ViewEncapsulation, OnInit, OnDestroy } from "@angular/core";
import { IArticle, IArticleBody } from "@app/app/editor/models/article.model";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { tap, map, takeUntil, switchMap } from "rxjs/operators";
import { Observable, Subject, of } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { LayoutService } from "@app/app/core/services/layout.service";
import { youtubeParser } from "@app/app/shared/helpers";

@Component({
  selector: "hm-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  ngUnSub = new Subject();
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
    this.route.paramMap.pipe(takeUntil(this.ngUnSub)).subscribe(params => {
      let id = params.get("id");
      if (!id) {
        this.layout.showArticle = false;
        this.meta$ = null;
        this.bodyList$ = null;
        this.safeYoutube = null;
        return;
      }
      this.layout.showArticle = true;
      this.meta$ = this.articles.list$.pipe(
        switchMap(articles =>
          articles && articles.length
            ? of(articles.find(x => x.id === id))
            : this.articles.getArticleData(id)
        ),
        tap(meta => {
          if (meta && meta.video) {
            let video = youtubeParser(meta.video);
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
      this.bodyList$ = this.articles.getBodyData(id);
    });
  }

  ngOnDestroy() {
    this.ngUnSub.next();
    this.ngUnSub.complete();
  }
}
