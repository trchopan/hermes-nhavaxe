import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  HousePricesCollection,
  CarPricesCollection,
  PriceListService
} from "@app/app/prices/services/price-list.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "hm-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"]
})
export class PricesComponent implements OnInit {
  ngUnsub = new Subject();
  collectionForm: FormGroup;
  collectionOptions: string[] = [HousePricesCollection, CarPricesCollection];

  houseCollection: string = HousePricesCollection;
  carCollection: string = CarPricesCollection;

  constructor(private fb: FormBuilder, public priceList: PriceListService) {
    this.collectionForm = this.fb.group({
      name: [HousePricesCollection]
    });

    this.collectionForm.controls.name.valueChanges
      .pipe(takeUntil(this.ngUnsub))
      .subscribe(name => this.priceList.setPriceCollection(name));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}
