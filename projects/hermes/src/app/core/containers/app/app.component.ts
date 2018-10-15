import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "@app/app/auth/services/user.service";
import { Title } from "@angular/platform-browser";
import { environment } from "@app/environments/environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  titleText: string = environment.title + " - Editor";

  buttonList = [
    { path: "article", icon: "art_track", text: "Bài viết" },
    { path: "videos", icon: "ondemand_video", text: "Youtube Videos" },
    { path: "specials", icon: "toc", text: "Bài đặc biệt" },
    { path: "tags", icon: "filter_list", text: "Tags và tìm kiếm" },
    { path: "prices", icon: "format_list_numbered", text: "Bảng giá" },
    { path: "banner", icon: "monetization_on", text: "Quảng cáo" }
  ];

  constructor(
    public user: UserService,
    private title: Title
  ) {
    this.title.setTitle(this.titleText);
  }
}
