import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import {
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatSelectModule,
  MatTableModule,
  MatSortModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { PricesComponent } from "./containers/prices/prices.component";
import { SharedModule } from "@app/app/shared/shared.module";
import { HousePricesFormComponent } from "./components/house-prices-form/house-prices-form.component";
import { HousePricesListComponent } from "./components/house-prices-list/house-prices-list.component";
import { CarPricesListComponent } from "./components/car-prices-list/car-prices-list.component";
import { CarPricesFormComponent } from "./components/car-prices-form/car-prices-form.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: PricesComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule
  ],
  declarations: [
    PricesComponent,
    HousePricesFormComponent,
    HousePricesListComponent,
    CarPricesListComponent,
    CarPricesFormComponent
  ],
  exports: [RouterModule]
})
export class PricesModule {}
