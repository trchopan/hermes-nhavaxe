import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { IVideo } from "../../models/videos.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { SafeHtml, DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { youtubeParser } from "@app/app/shared/helpers";

@Component({
  selector: "hm-vidoes-form",
  templateUrl: "./vidoes-form.component.html",
  styleUrls: ["./vidoes-form.component.scss"]
})
export class VidoesFormComponent implements OnInit {
  @Output()
  onSubmit = new EventEmitter();

  form: FormGroup;
  controls: FormControl[];
  coverImg$: Observable<string>;
  safeYoutube$: Observable<SafeHtml>;

  constructor(
    private fb: FormBuilder,
    private dom: DomSanitizer,
    public dialogRef: MatDialogRef<VidoesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { index: number; video: IVideo }
  ) {
    let { index, video } = this.data;
    this.form = this.fb.group({
      coverImg: [index >= 0 ? video.coverImg : "", Validators.required],
      title: [index >= 0 ? video.title : "", Validators.required],
      link: [index >= 0 ? video.link : "", Validators.required]
    });
  }

  ngOnInit() {
    this.coverImg$ = this.form.controls.coverImg.valueChanges.pipe(
      startWith(this.data.index >= 0 ? this.data.video.coverImg : ""),
      map(value => value)
    );
    this.safeYoutube$ = this.form.controls.link.valueChanges.pipe(
      startWith(this.data.index >= 0 ? this.data.video.link : ""),
      map(value => {
        let video = youtubeParser(value);
        let html = `
        <iframe
          src="https://www.youtube.com/embed/${video}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen></iframe>
        `;
        return this.dom.bypassSecurityTrustHtml(html);
      })
    );
  }

  submit() {
    if (this.form.valid)
      this.dialogRef.close({ index: this.data.index, video: this.form.value });
  }
}
