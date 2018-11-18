import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArticlesService } from "@app/app/editor/services/articles.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { IArticle } from "@app/app/editor/models/article.model";
import { Subject } from "rxjs";
import { UserService } from "@app/app/auth/services/user.service";
import { statusMap } from "../../models/query.model";
import { Router } from "@angular/router";

@Component({
  selector: "hermes-editor-articles-search",
  templateUrl: "./articles-search.component.html",
  styleUrls: ["./articles-search.component.scss"]
})
export class ArticlesSearchComponent implements OnInit, OnDestroy {
  pageSize: number = 10;

  ngUnsub = new Subject();
  loading: boolean;
  form: FormGroup;
  queryDate: number;
  articlesList: IArticle[];
  statusMap = statusMap;

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    private fb: FormBuilder,
    private router: Router
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

  handleFabClick() {
    this.router.navigate(["article/create"]);
  }
}
