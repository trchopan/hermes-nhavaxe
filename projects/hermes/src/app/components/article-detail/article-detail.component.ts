import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import {
  IArticle,
  IArticleBody
} from "@editor/app/editor/models/article.model";
import { ArticlesService } from "@app/app/services/articles.service";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { trigger, style, animate, transition } from "@angular/animations";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LayoutService } from "@app/app/services/layout.service";

@Component({
  selector: "hm-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("showAnimation", [
      transition(":enter", [
        style({
          transform: "translateX(100vw)",
          opacity: "0",
          display: "block"
        }),
        animate(
          "200ms ease-in",
          style({ transform: "translateX(0)", opacity: "1" })
        )
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({
            transform: "translateX(100vw)",
            opacity: "0",
            display: "none"
          })
        )
      ])
    ])
  ]
})
export class ArticleDetailComponent implements OnInit {
  meta$: Observable<IArticle>;
  body$: Observable<IArticleBody>;
  safeYoutube: SafeHtml;

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
        this.body$ = null;
        this.safeYoutube = null;
        return;
      }
      this.layout.showArticle = true;
      this.layout.fixedNav = true;
      this.meta$ = this.articles.getArticleData(id).pipe(
        tap(meta => {
          if (meta && meta.video) {
            let html = `
              <iframe
                src="https://www.youtube.com/embed/${meta.video}"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen></iframe>
              `;
            this.safeYoutube = this.dom.bypassSecurityTrustHtml(html);
          }
        })
      );
      this.body$ = this.articles.getBodyData(id);
    });
  }
}
