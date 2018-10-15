import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IVideo, IVideoData } from "@app/app/videos/models/videos.model";
import { MatDialog } from "@angular/material";
import { VidoesFormComponent } from "../vidoes-form/vidoes-form.component";
import { VideosService } from "../../services/videos.service";

@Component({
  selector: "hm-vidoes-list",
  templateUrl: "./vidoes-list.component.html",
  styleUrls: ["./vidoes-list.component.scss"]
})
export class VidoesListComponent implements OnInit {
  @Input("data")
  set dataSetter(data: IVideoData) {
    if (data && data.videos) {
      this.videosList = data.videos;
      this.creatorName = data.creatorName;
      this.publishAt = data.publishAt;
    }
  }
  @Output()
  selected = new EventEmitter();

  videosList: IVideo[];
  creatorName: string;
  publishAt: number;

  constructor(public dialog: MatDialog, private videos: VideosService) {}

  ngOnInit() {
    this.videosList = [];
  }

  edit(video: IVideo) {
    this.selected.emit(video);
  }

  swap(to: number, from: number) {
    let x = this.videosList[to];
    this.videosList[to] = this.videosList[from];
    this.videosList[from] = x;
  }

  openDialog(index: number, video: IVideo) {
    const dialogRef = this.dialog.open(VidoesFormComponent, {
      width: "80%",
      data: { index, video }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data || !data.video) return;
      if (data.index > 0) {
        this.videosList[index] = data.video;
      } else {
        this.videosList.splice(0, 0, data.video);
      }
    });
  }

  update() {
    this.videos.update(this.videosList);
  }
}
