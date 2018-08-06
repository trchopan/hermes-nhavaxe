import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "@editor/app/auth/services/user.service";
import { Title } from "@angular/platform-browser";
import { environment } from "@editor/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  titleText: string = environment.title + " - Editor";

  buttonList = [
    { path: ["article", "create"], icon: "edit", text: "Tạo bài viết" },
    { path: "article", icon: "list", text: "Danh sách bài viết" },
    { path: "tags", icon: "filter_list", text: "Quản lý Tags" },
    { path: "profile", icon: "account_circle", text: "Tài khoản" }
  ];

  constructor(
    public user: UserService,
    private router: Router,
    private title: Title
  ) {
    this.title.setTitle(this.titleText);
  }
}
