import { Component, OnInit, Input } from "@angular/core";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-house-prices-form",
  templateUrl: "./house-prices-form.component.html",
  styleUrls: ["./house-prices-form.component.scss"]
})
export class HousePricesFormComponent implements OnInit {
  @Input("field")
  set fieldSetter(field: IHousePrice) {
    if (!field) return;
    this.initPublishAt = field.publishAt;
    this.form.setValue(field);
  }

  private className = "HousePriceForm ";
  ngUnsub = new Subject();
  form: FormGroup;
  initPublishAt: number = Date.now();

  constructor(
    private priceList: PriceListService,
    private fb: FormBuilder,
    private layout: LayoutService
  ) {
    this.form = this.fb.group({
      id: [""],
      image: ["", Validators.required],
      project: ["", Validators.required],
      investor: ["", Validators.required],
      location: ["", Validators.required],
      scale: ["", Validators.required],
      progress: ["", Validators.required],
      salePerks: ["", Validators.required],
      facilities: ["", Validators.required],
      avgPrice: [0, Validators.required],
      avgResalePrice: [0, Validators.required],
      contacts: ["", Validators.required],
      link: ["", Validators.required],
      publishAt: [Date.now(), Validators.required]
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
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
              this.layout.handleSuccess(this.className, "/prices");
              this.onReset();
            })
            .catch(err =>
              this.layout.handleError(this.className, "create", err)
            )
        : this.priceList
            .update(this.form.value)
            .then(() => {
              this.layout.handleSuccess(this.className, "/prices");
              this.onReset();
            })
            .catch(err =>
              this.layout.handleError(this.className, "update", err)
            );
    } else {
      console.log("woot", this.form.value);
      this.layout.formError();
    }
  }

  onReset() {
    this.form.reset();
    this.form.enable();
    this.form.markAsPristine();
  }
}
