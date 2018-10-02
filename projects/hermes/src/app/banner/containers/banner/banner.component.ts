import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { IBanner } from '@app/app/banner/models/banner.model';
import { BannerFormComponent } from '@app/app/banner/components/banner-form/banner-form.component';

@Component({
  selector: 'hm-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openCreateForm() {
    this.dialog.open(BannerFormComponent, {
      width: "80%",
      data: {}
    });
  }
}
