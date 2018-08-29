import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { MatTableDataSource } from "@angular/material";
import { IHousePrice } from "@app/app/prices/models/houseprice.model";
import { environment } from "@bang-gia/environments/environment";

@Component({
  selector: "bg-house-price",
  templateUrl: "./house-price.component.html",
  styleUrls: ["./house-price.component.scss"],
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
export class HousePriceComponent implements OnInit {
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
  dataSource: MatTableDataSource<IHousePrice>;
  expandedElement: IHousePrice;
  options = { project: [], investor: [], location: [] };
  filterValue: string;

  constructor() {}

  ngOnInit() {
    fetch(`${environment.housepricesApi}`)
      .then(respond => respond.json())
      .then(data => {
        if (data.error) {
          console.log("API error", data.error);
          this.dataSource = null;
          return;
        }
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

  applyFilter() {
    this.dataSource.filter = this.filterValue;
  }

  selectField(field) {
    this.expandedElement =
      this.expandedElement && this.expandedElement.id === field.id
        ? null
        : field;
  }
}
