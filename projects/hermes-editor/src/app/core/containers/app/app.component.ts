import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "@editor/app/auth/services/user.service";
import { MlILinkList } from "@editor/app/core/models/link-list.model";
import * as screenfull from "screenfull";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  linkList: MlILinkList[] = [
    { path: "/list", icon: "home", text: "Danh sách bài viết" },
    { path: "/create", icon: "edit", text: "Tạo bài viết" },
    { path: "/profile", icon: "account_circle", text: "Tài khoản" }
  ];

  constructor(public user: UserService, private router: Router) {}

  navigate = (route: string) => this.router.navigate([route]);

  fullscreen = () => (screenfull.enabled ? screenfull.toggle() : null);
}
