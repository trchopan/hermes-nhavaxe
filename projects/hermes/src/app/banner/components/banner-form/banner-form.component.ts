import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BannerService } from "@app/app/banner/services/banner.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  IBanner,
  AreaOptions,
  TypeOptions,
  StatusOptions
} from "@app/app/banner/models/banner.model";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-banner-form",
  templateUrl: "./banner-form.component.html",
  styleUrls: ["./banner-form.component.scss"]
})
export class BannerFormComponent implements OnInit {
  className = "BannerForm";
  form: FormGroup;
  initExpire: number = this.data.expire || Date.now();
  typeOptions = Object.values(TypeOptions);
  areaOptions = Object.values(AreaOptions);
  statusOptions = Object.values(StatusOptions);

  constructor(
    public layout: LayoutService,
    private fb: FormBuilder,
    private banner: BannerService,
    public dialogRef: MatDialogRef<BannerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBanner
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id],
      customer: [this.data.customer, Validators.required],
      contentLink: [this.data.contentLink, Validators.required],
      type: [this.data.type, Validators.required],
      link: [this.data.link, Validators.required],
      area: [this.data.area, Validators.required],
      status: [this.data.status, Validators.required],
      expire: [this.data.expire, Validators.required]
    });
  }

  setExpire(expire: number) {
    this.form.controls.expire.setValue(expire);
    this.form.controls.expire.markAsDirty();
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("form value", this.form.value);
      this.form.disable();

      // No id means create new entry
      if (!this.form.value.id) {
        this.banner
          .create(this.form.value)
          .then(() => {
            this.layout.handleSuccess(this.className, null);
            this.dialogRef.close();
          })
          .catch(err => {
            this.layout.handleError(this.className, "create", err);
            this.form.enable();
          });
      } else {
        this.banner
          .update(this.form.value)
          .then(() => {
            this.layout.handleSuccess(this.className, null);
            this.dialogRef.close();
          })
          .catch(err => {
            this.layout.handleError(this.className, "update", err);
            this.form.enable();
          });
      }
    } else {
      this.layout.snackWarning("Form chưa hoàn thành");
    }
  }

  onDelete() {
    this.form.disable();
    this.banner
      .remove(this.form.value)
      .then(() => {
        this.layout.handleSuccess(this.className, null);
        this.dialogRef.close();
      })
      .catch(err => {
        this.layout.handleError(this.className, "remove", err);
        this.form.enable();
      });
  }

  onReset() {
    this.layout.error$.next(null);
    this.form.reset();
    this.form.controls.id.setValue(this.data.id);
    this.form.enable();
    this.form.markAsPristine();
  }

  onCancle() {
    this.layout.error$.next(null);
    this.dialogRef.close();
  }
}
