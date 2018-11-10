import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar, PageEvent } from "@angular/material";
import { IArticle } from "@app/app/editor/models/article.model";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { UserService } from "@app/app/auth/services/user.service";
import { statusMap } from "../../models/query.model";

@Component({
  selector: "hermes-editor-articles-list",
  templateUrl: "./articles-list.component.html",
  styleUrls: ["./articles-list.component.scss"]
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  pageSize: number = 10;

  ngUnsub = new Subject();
  loading: boolean;
  form: FormGroup;
  queryDate: number;
  articlesList: IArticle[];
  pageEvent$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(null);
  statusMap = statusMap;

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.queryDate = this.articles.query$.value.fromDate;

    this.form = this.fb.group({
      fromDate: [this.queryDate],
      creatorId: [this.articles.query$.value.creatorId],
      status: [this.articles.query$.value.status],
      range: [this.articles.query$.value.range]
    });

    this.form.valueChanges.pipe(takeUntil(this.ngUnsub)).subscribe(value => {
      this.articles.setQuery(value);
    });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  setFromDate(date: number) {
    this.form.controls.fromDate.setValue(date);
  }

  edit(article: IArticle) {
    if (this.articles.isEditable(article.status)) {
      this.router.navigate(["article/edit", article.id]);
    } else {
      console.log("[Articles] locked", article);
      this.snackbar.open("Bài đã bị khoá", null, { duration: 1500 });
    }
  }

  preview(article: IArticle) {
    this.router.navigate(["article", article.id]);
  }

  handlePageChange(event: PageEvent) {
    this.pageEvent$.next(event);
  }

  handleFabClick() {
    this.router.navigate(["article/create"]);
  }
}
