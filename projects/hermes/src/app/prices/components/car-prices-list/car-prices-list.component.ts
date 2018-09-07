import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { MatTableDataSource, MatSort, MatDialog } from "@angular/material";
import { PriceListService } from "@app/app/prices/services/price-list.service";
import { takeUntil } from "rxjs/operators";
import { ICarPrice } from "@app/app/prices/models/carprice.model";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { CarPricesFormComponent } from "@app/app/prices/components/car-prices-form/car-prices-form.component";

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
  ngUnsub = new Subject();
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
  dataSource: MatTableDataSource<ICarPrice> = null;
  options = { brand: [], type: [], origin: [] };
  filterValue: string;
  expandedElement: ICarPrice;

  constructor(public priceList: PriceListService, public dialog: MatDialog) {}

  @ViewChild(MatSort)
  sort: MatSort;

  ngOnInit() {
    this.priceList.priceData$.pipe(takeUntil(this.ngUnsub)).subscribe(data => {
      console.log("data is ", data);
      Object.keys(this.options).forEach(key => {
        this.options[key] = data
          .map(value => value[key])
          .sort()
          .filter((item, pos, arr) => !pos || item != arr[pos - 1]);
      });

      this.dataSource = new MatTableDataSource<ICarPrice>(data);
      console.log("this sort", this.sort);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  selectField(field: ICarPrice) {
    this.dialog.open(CarPricesFormComponent, {
      width: "80%",
      data: field || {}
    });
  }
}
