import { Component, OnInit } from "@angular/core";
import { TagService } from "@editor/app/tags/services/tag.service";

@Component({
  selector: "hm-editor-tags-list",
  templateUrl: "./tags-list.component.html",
  styleUrls: ["./tags-list.component.scss"]
})
export class TagsListComponent implements OnInit {
  constructor(public tags: TagService) {}

  ngOnInit() {}
}
