import { Component, Inject } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material";

@Component({
  selector: "hm-snack-warning",
  templateUrl: "./snack-warning.component.html",
  styleUrls: ["./snack-warning.component.scss"]
})
export class SnackWarningComponent {
  constructor(
    public snackRef: MatSnackBarRef<SnackWarningComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: string
  ) {}
}
