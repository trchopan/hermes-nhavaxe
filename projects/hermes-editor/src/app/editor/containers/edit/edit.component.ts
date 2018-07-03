import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "@editor/app/auth/services/user.service";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { Router } from "@angular/router";
import { IArticle } from "@editor/app/editor/models/article.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "hm-editor-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();
  loading: boolean = true;
  article: IArticle;

  constructor(
    public user: UserService,
    public articles: ArticlesService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.articles.selected$
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(selected => {
        if (selected) {
          this.article = selected;
        } else {
          this.router.navigate(["/list"]);
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  handleEdit(article: IArticle) {
    this.loading = true;
    this.articles
      .update(article)
      .then(() => {
        this.router.navigate(["/list"]);
        this.snackbar.open("Bài viết đã được cập nhật", null, {
          duration: 1000
        });
      })
      .catch(error => {
        console.error("Creating Article error", error);
        this.snackbar.open("Lỗi cập nhật bài viết", null, { duration: 1000 });
      });
  }
}
