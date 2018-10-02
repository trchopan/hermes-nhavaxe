import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  IBanner,
  TypeOptions,
  AreaOptions,
  StatusOptions
} from "@app/app/banner/models/banner.model";
import { MatDialog, MatTableDataSource, MatSort } from "@angular/material";
import { BannerFormComponent } from "@app/app/banner/components/banner-form/banner-form.component";
import { BannerService } from "@app/app/banner/services/banner.service";
import { Subject } from "rxjs";
import { map, tap, takeUntil } from "rxjs/operators";

@Component({
  selector: "hm-banner-list",
  templateUrl: "./banner-list.component.html",
  styleUrls: ["./banner-list.component.scss"]
})
export class BannerListComponent implements OnInit, OnDestroy {
  ngUnsub = new Subject();
  typeOptions = Object.values(TypeOptions);
  areaOptions = Object.values(AreaOptions);
  statusOptions = Object.values(StatusOptions);
  customerList: string[];
  filterValue: string;
  dataSource: MatTableDataSource<IBanner>;
  displayedColumns: string[] = [
    "area",
    "customer",
    "type",
    "link",
    "expire",
    "status",
    "count"
  ];

  constructor(public dialog: MatDialog, public banner: BannerService) {}

  ngOnInit() {
    this.banner.bannerList$.pipe(takeUntil(this.ngUnsub)).subscribe(list => {
      this.customerList = list
        .map(data => data.customer)
        .sort()
        .filter((item, pos, arr) => !pos || item != arr[pos - 1]);
      this.dataSource = new MatTableDataSource(
        list.sort((a, b) => b.expire - a.expire)
      );
      this.applyFilter();
    });
  }

  ngOnDestroy() {
    this.ngUnsub.next();
    this.ngUnsub.complete();
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue;
  }

  selectField(field: IBanner) {
    this.dialog.open(BannerFormComponent, {
      width: "80%",
      data: field
    });
  }

  parseArea(value: string): string {
    const area = this.areaOptions.find(x => x.id === value);
    return area ? area.text : "Unknown";
  }

  parseStatus(value: string): string {
    const status = this.statusOptions.find(x => x.id === value);
    return status ? status.text : "Unknown";
  }
}
