import { Component, OnInit } from "@angular/core";
import { IFieldData } from "@admin/app/fields.models";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { Observable } from "rxjs";

@Component({
  selector: "hm-price-list",
  templateUrl: "./price-list.component.html",
  styleUrls: ["./price-list.component.scss"]
})
export class PriceListComponent implements OnInit {
  fieldData$: Observable<IFieldData[]>;

  constructor(private priceList: PriceListService) {}

  ngOnInit() {
    this.fieldData$ = this.priceList.getFields();
  }
}
