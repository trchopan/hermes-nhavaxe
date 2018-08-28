import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { MatTableDataSource } from "@angular/material";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { takeUntil } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";

@Component({
  selector: "hm-house-prices-list",
  templateUrl: "./house-prices-list.component.html",
  styleUrls: ["./house-prices-list.component.scss"],
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
export class HousePricesListComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();
  displayedColumns: string[] = [
    "project",
    "investor",
    "location",
    "progress",
    "avgPrice",
    "avgResalePrice",
    "publishAt"
  ];
  dataSource$: Observable<MatTableDataSource<IHousePrice>>;
  dataSource: MatTableDataSource<IHousePrice>;
  expandedElement: IHousePrice;
  options = { project: [], investor: [], location: [] };
  filterValue: string;

  constructor(public priceList: PriceListService) {}

  ngOnInit() {
    this.priceList.priceData$.pipe(takeUntil(this.ngUnsub)).subscribe(data => {
      console.log("data is ", data);
      Object.keys(this.options).forEach(key => {
        this.options[key] = data
          .map(value => value[key])
          .filter((item, pos, arr) => !pos || item != arr[pos - 1]);
      });

      this.options.location = this.options.location
        .map((location: string) => {
          let loc = location.split(",").map(x => x.trim());
          let result = loc[loc.length - 2] + ", " + loc[loc.length - 1];
          return result;
        })
        .sort()
        .filter((item, pos, arr) => !pos || item != arr[pos - 1]);

      this.dataSource = new MatTableDataSource<IHousePrice>(data);
    });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
  }

  selectField(field) {
    this.priceList.selectedField$.next(field);
    this.expandedElement =
      this.expandedElement && this.expandedElement.id === field.id
        ? null
        : field;
  }
}
