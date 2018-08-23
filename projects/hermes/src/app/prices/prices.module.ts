import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import { PriceListComponent } from "@app/app/prices/containers/price-list/price-list.component";
import { MatSnackBarModule } from "@angular/material";
import { PriceItemFormComponent } from "@app/app/prices/components/price-item-form/price-item-form.component";

const routes: Routes = [
  {
    path: "prices",
    component: PriceListComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), MatSnackBarModule],
  declarations: [PriceListComponent, PriceItemFormComponent]
})
export class PricesModule {}
