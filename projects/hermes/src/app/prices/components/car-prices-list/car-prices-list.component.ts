import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { MatTableDataSource } from "@angular/material";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { startWith, map } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "hm-car-prices-list",
  templateUrl: "./car-prices-list.component.html",
  styleUrls: ["./car-prices-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class CarPricesListComponent implements OnInit {
  displayedColumns: string[] = [
    "model",
    "brand",
    "type",
    "origin",
    "engine",
    "listPrice",
    "salePrice",
    "publishAt"
  ];
  dataSource$: Observable<MatTableDataSource<IHousePrice>>;
  expandedElement: IHousePrice;

  constructor(public priceList: PriceListService) {}

  ngOnInit() {
    this.dataSource$ = this.priceList.priceData$.pipe(
      startWith([]),
      map(data => new MatTableDataSource(data))
    );
  }

  ngOnDestroy() {}

  selectField(field) {
    this.priceList.selectedField$.next(field);
    this.expandedElement = this.expandedElement == field ? null : field;
  }
}
