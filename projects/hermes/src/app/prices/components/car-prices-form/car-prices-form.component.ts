import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { LayoutService } from "@app/app/core/services/layout.service";
import { ICarPrice } from "@app/app/prices/models/carprice.model";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: "hm-car-prices-form",
  templateUrl: "./car-prices-form.component.html",
  styleUrls: ["./car-prices-form.component.scss"]
})
export class CarPricesFormComponent implements OnInit {
  private className = "CarPriceForm ";
  form: FormGroup;
  initPublishAt: number = this.data.publishAt || Date.now();

  constructor(
    private priceList: PriceListService,
    private fb: FormBuilder,
    private layout: LayoutService,
    public dialogRef: MatDialogRef<CarPricesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICarPrice
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.id],
      image: [this.data.image, Validators.required],
      model: [this.data.model, Validators.required],
      brand: [this.data.brand, Validators.required],
      type: [this.data.type, Validators.required],
      origin: [this.data.origin, Validators.required],
      engine: [this.data.engine, Validators.required],
      power: [this.data.power, Validators.required],
      torque: [this.data.torque, Validators.required],
      listPrice: [this.data.listPrice, Validators.required],
      salePrice: [this.data.salePrice, Validators.required],
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
            .then(() => {
              this.layout.handleSuccess(this.className, null);
              this.onReset();
            })
            .catch(err =>
              this.layout.handleError(this.className, "create", err)
            )
        : this.priceList
            .update(this.form.value)
            .then(() => {
              this.layout.handleSuccess(this.className, null);
              this.onReset();
            })
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
      .then(() => {
        this.layout.handleSuccess(this.className, null);
        this.onReset();
      })
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
