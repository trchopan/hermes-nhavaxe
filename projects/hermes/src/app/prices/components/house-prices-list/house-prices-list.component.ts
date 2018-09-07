import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { MatTableDataSource, MatDialog } from "@angular/material";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { takeUntil } from "rxjs/operators";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { HousePricesFormComponent } from "@app/app/prices/components/house-prices-form/house-prices-form.component";

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
    "salePerks",
    "avgPrice",
    "avgResalePrice",
    "contacts",
    "facilities",
    "publishAt"
  ];
  dataSource$: Observable<MatTableDataSource<IHousePrice>>;
  dataSource: MatTableDataSource<IHousePrice>;
  options = { project: [], investor: [], location: [] };
  filterValue: string;

  constructor(public priceList: PriceListService, public dialog: MatDialog) {}

  ngOnInit() {
    this.priceList.priceData$.pipe(takeUntil(this.ngUnsub)).subscribe(data => {
      console.log("data is ", data);
      Object.keys(this.options).forEach(key => {
        this.options[key] = data
          .map(value => value[key])
          .sort()
          .filter((item, pos, arr) => !pos || item != arr[pos - 1]);
      });

      this.dataSource = new MatTableDataSource<IHousePrice>(data);
    });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  selectField(field: IHousePrice) {
    this.dialog.open(HousePricesFormComponent, {
      width: "80%",
      data: field || {}
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
  }
}
