import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "ml-toolbar",
  templateUrl: "ml-toolbar.component.html",
  styleUrls: ["ml-toolbar.component.scss"]
})
export class MlToolbarComponent {
  @Input() avatarImg: string;
  @Input() loading: boolean;
  @Input() fixed: boolean;
  @Output() openSideNav = new EventEmitter();
  @Output() logoClicked = new EventEmitter();
  @Output() avatarClicked = new EventEmitter();
}
