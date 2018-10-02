import { Component, OnInit } from "@angular/core";
import { PricesService } from "@app/app/prices/services/prices.service";
import { LayoutService } from "@app/app/core/services/layout.service";

@Component({
  selector: "hm-prices",
  templateUrl: "./prices.component.html",
  styleUrls: ["./prices.component.scss"]
})
export class PricesComponent implements OnInit {
  constructor(public prices: PricesService, public layout: LayoutService) {}

  ngOnInit() {}
}
