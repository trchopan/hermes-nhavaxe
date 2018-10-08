import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpecialsComponent } from "./containers/specials/specials.component";
import { Routes, RouterModule } from "@angular/router";
import { SpecialsFormComponent } from "./components/specials-form/specials-form.component";
import { SpecialsService } from "@app/app/specials/services/specials.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule
} from "@angular/material";
import { SharedModule } from "@app/app/shared/shared.module";

const routes: Routes = [
  { path: "", pathMatch: "full", component: SpecialsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [SpecialsService],
  declarations: [SpecialsComponent, SpecialsFormComponent]
})
export class SpecialsModule {}
