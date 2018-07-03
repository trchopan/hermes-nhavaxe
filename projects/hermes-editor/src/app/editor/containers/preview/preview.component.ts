import { Component, OnInit, OnDestroy } from "@angular/core";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { UserService } from "@editor/app/auth/services/user.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { IArticle } from "@editor/app/editor/models/article.model";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "hm-editor-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"]
})
export class PreviewComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();
  loading: boolean = true;
  article: IArticle;
  form: FormGroup;

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    private router: Router,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      note: [""],
      status: [""],
      managerId: [""],
      managerName: [""],
      modifiedAt: [0]
    });
  }

  ngOnInit() {
    this.articles.selected$
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(selected => {
        if (selected) {
          this.article = selected;
        } else {
          this.router.navigate(["/"]);
        }
        if (this.user.isManager) {
          this.form.controls.note.setValue(selected.note);
          this.form.controls.status.setValue(selected.status);
          this.form.controls.managerId.setValue(this.user.authData.id);
          this.form.controls.managerName.setValue(
            this.user.managerProf.fullname
          );
          this.form.controls.modifiedAt.setValue(Date.now());
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  submit() {
    let newArticle = Object.assign({}, this.article, this.form.value);
    this.loading = true;
    this.articles
      .update(newArticle)
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
