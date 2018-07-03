import { Component } from "@angular/core";
import { UserService } from "@editor/app/auth/services/user.service";
import { Router } from "@angular/router";
import { ArticlesService } from "@editor/app/editor/services/articles.service";
import { IArticle } from "@editor/app/editor/models/article.model";
import { Subject } from "rxjs";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "hm-editor-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent {
  ngUnsub = new Subject();
  loading: boolean = false;

  constructor(
    public user: UserService,
    private router: Router,
    private articles: ArticlesService,
    private snackbar: MatSnackBar
  ) {}

  handleCreate(article: IArticle) {
    this.loading = true;
    this.articles
      .create(article)
      .then(() => {
        this.router.navigate(["/list"]);
        this.snackbar.open("Bài viết đã được tạo", null, {
          duration: 1000
        });
      })
      .catch(error => {
        console.error("Creating Article error", error);
        this.snackbar.open("Lỗi tạo bài mới", null, { duration: 1000 });
      });
  }
}
