import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import {
  HousePricesCollection,
  CarPricesCollection,
  PriceListService
} from "@app/app/prices/services/price-list.service";
import { Subject } from "rxjs";
import { takeUntil, startWith } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "hm-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"]
})
export class PricesComponent implements OnInit {
  ngUnsub = new Subject();
  collectionForm: FormGroup;
  collectionOptions: string[] = [HousePricesCollection, CarPricesCollection];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public priceList: PriceListService
  ) {
    this.collectionForm = this.fb.group({
      name: [HousePricesCollection]
    });

    this.collectionForm.controls.name.valueChanges
      .pipe(
        takeUntil(this.ngUnsub),
        startWith(HousePricesCollection)
      )
      .subscribe(name => {
        this.priceList.setPriceCollection(name);
        this.router.navigate([name], { relativeTo: this.route });
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }
}
