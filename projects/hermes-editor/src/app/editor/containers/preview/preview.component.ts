import { Component, OnInit } from "@angular/core";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { UserService } from "@editor/app/auth/services/user.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject, Observable, combineLatest } from "rxjs";
import { IArticle } from "@editor/app/editor/models/article.model";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "hm-editor-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"]
})
export class PreviewComponent implements OnInit {
  article$: Observable<IArticle>;
  article: IArticle;
  form: FormGroup;

  constructor(
    public articles: ArticlesService,
    public user: UserService,
    private route: ActivatedRoute,
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
    this.article$ = combineLatest(
      this.articles.list$,
      this.route.paramMap
    ).pipe(
      map(([articles, params]) => {
        this.article = articles.find(
          article => article.id === params.get("id")
        );
        if (this.user.isManager && this.article) {
          this.form.controls.note.setValue(this.article.note);
          this.form.controls.status.setValue(this.article.status);
          this.form.controls.managerId.setValue(this.user.authData.id);
          this.form.controls.managerName.setValue(
            this.user.managerProf.fullname
          );
          this.form.controls.modifiedAt.setValue(Date.now());
        }
        return this.article;
      })
    );
  }

  submit() {
    let newArticle = Object.assign({}, this.article, this.form.value);
    this.articles.update(newArticle);
  }
}
