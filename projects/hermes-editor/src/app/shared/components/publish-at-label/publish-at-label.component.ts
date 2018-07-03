import { Component, Input } from "@angular/core";

@Component({
  selector: "publish-at-label",
  templateUrl: "./publish-at-label.component.html",
  styleUrls: ["./publish-at-label.component.scss"]
})
export class PublishAtLabelComponent {
  @Input() publishAt: number;
  now = Date.now();
}
