import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatSnackBar, PageEvent } from "@angular/material";
import { IArticle } from "@app/app/editor/models/article.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { UserService } from "@app/app/auth/services/user.service";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: "hermes-editor-articles-list",
  templateUrl: "./articles-list.component.html",
  styleUrls: ["./articles-list.component.scss"]
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();
  loading: boolean;
  form: FormGroup;
  queryDate: number;
  articlesList: IArticle[];
  list: IArticle[];
  pageSize: number = 10;
  editorList$: Observable<{ id: string; name: string }[]>;
  pageEvent$: BehaviorSubject<PageEvent> = new BehaviorSubject<PageEvent>(null);

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    private fb: FormBuilder,
    private router: Router,
    private snackbar: MatSnackBar,
    private aFs: AngularFirestore
  ) {}

  ngOnInit() {
    this.articles.list$.pipe(takeUntil(this.ngUnsub)).subscribe(list => {
      this.articlesList = list;
      this.pageEvent$.next({
        previousPageIndex: 0,
        pageIndex: 0,
        pageSize: this.pageSize,
        length: list ? list.length : 0
      });
    });

    this.pageEvent$
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(
        event =>
          this.articlesList
            ? (this.list = this.articlesList.slice(
                event.pageIndex * event.pageSize,
                (event.pageIndex + 1) * event.pageSize
              ))
            : null
      );

    this.queryDate =
      this.articles.query$.value.fromDate || new Date().setHours(0, 0, 0, 0);

    this.form = this.fb.group({
      fromDate: [this.queryDate],
      creatorId: [null],
      status: [this.articles.query$.value.status],
      range: [this.articles.query$.value.range]
    });

    this.form.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        distinctUntilChanged()
      )
      .subscribe(value => this.articles.setQuery(value));
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  setFromDate(date: Date) {
    this.form.controls.fromDate.setValue(date.getTime());
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
}
