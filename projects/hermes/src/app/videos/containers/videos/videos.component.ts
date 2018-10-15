import { Component, OnInit } from "@angular/core";
import { VideosService } from "../../services/videos.service";

@Component({
  selector: "hm-videos",
  templateUrl: "./videos.component.html",
  styleUrls: ["./videos.component.scss"]
})
export class VideosComponent implements OnInit {
  constructor(public videos: VideosService) {}

  ngOnInit() {}
}
