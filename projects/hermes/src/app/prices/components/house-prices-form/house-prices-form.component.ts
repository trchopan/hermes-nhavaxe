import { Component, OnInit, Inject } from "@angular/core";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { LayoutService } from "@app/app/core/services/layout.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "hm-house-prices-form",
  templateUrl: "./house-prices-form.component.html",
  styleUrls: ["./house-prices-form.component.scss"]
})
export class HousePricesFormComponent implements OnInit {
  private className = "HousePriceForm ";
  ngUnsub = new Subject();
  form: FormGroup;
  initPublishAt: number = this.data.publishAt || Date.now();

  constructor(
    private priceList: PriceListService,
    private fb: FormBuilder,
    private layout: LayoutService,
    public dialogRef: MatDialogRef<HousePricesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IHousePrice
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id],
      image: [this.data.image, Validators.required],
      project: [this.data.project, Validators.required],
      investor: [this.data.investor, Validators.required],
      location: [this.data.location, Validators.required],
      scale: [this.data.scale, Validators.required],
      progress: [this.data.progress, Validators.required],
      salePerks: [this.data.salePerks, Validators.required],
      facilities: [this.data.facilities, Validators.required],
      avgPrice: [this.data.avgPrice, Validators.required],
      avgResalePrice: [this.data.avgResalePrice, Validators.required],
      contacts: [this.data.contacts, Validators.required],
      link: [this.data.link, Validators.required],
      publishAt: [this.data.publishAt, Validators.required]
    });
  }

  setPublishAt(publishAt: number) {
    this.form.controls.publishAt.setValue(publishAt);
    this.form.controls.publishAt.markAsDirty();
  }

  onSubmit() {
    if (this.form.valid) {
      console.log("form value", this.form.value);
      this.form.disable();
      !this.form.value.id
        ? this.priceList
            .create(this.form.value)
            .then(() => this.layout.handleSuccess(this.className, null))
            .catch(err =>
              this.layout.handleError(this.className, "create", err)
            )
        : this.priceList
            .update(this.form.value)
            .then(() => this.layout.handleSuccess(this.className, null))
            .catch(err =>
              this.layout.handleError(this.className, "update", err)
            );
      this.dialogRef.close();
    } else {
      console.log("woot", this.form.value);
      this.layout.formError();
    }
  }

  onDelete() {
    this.form.disable();
    this.priceList
      .remove(this.form.value.id)
      .then(() => this.layout.handleSuccess(this.className, null))
      .catch(err => this.layout.handleError(this.className, "create", err));
    this.dialogRef.close();
  }

  onReset() {
    this.form.reset();
    this.form.enable();
    this.form.markAsPristine();
  }

  onCancle() {
    this.dialogRef.close();
  }
}
