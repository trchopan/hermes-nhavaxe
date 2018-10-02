import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MatButtonModule, MatIconModule } from "@angular/material";
import { PricesComponent } from "./containers/prices/prices.component";
import { PricesService } from "@app/app/prices/services/prices.service";

const routes: Routes = [
  { path: "", pathMatch: "full", component: PricesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule
  ],
  declarations: [PricesComponent],
  providers: [PricesService],
  exports: [RouterModule]
})
export class PricesModule {}
