import { Component } from "@angular/core";
import { LayoutService } from "@editor/app/core/services/layout.service";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "hm-editor-loading-spinner",
  templateUrl: "./loading-spinner.component.html",
  styleUrls: ["./loading-spinner.component.scss"],
  animations: [
    trigger("spinnerShow", [
      transition(":enter", [
        style({ transform: "translateY(2rem)", opacity: "0" }),
        animate(
          "200ms ease-in",
          style({ transform: "translateY(0)", opacity: "1" })
        )
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ transform: "translateY(2rem)", opacity: "0" })
        )
      ])
    ])
  ]
})
export class LoadingSpinnerComponent {
  constructor(public layout: LayoutService) {}
}
