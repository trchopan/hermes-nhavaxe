import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "hm-dialog-confirmation",
  templateUrl: "./dialog-confirmation.component.html",
  styleUrls: ["./dialog-confirmation.component.scss"]
})
export class DialogConfirmationComponent implements OnInit {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit() {
    this.message = this.data;
  }
}
