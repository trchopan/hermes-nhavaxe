import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BannerComponent } from "./containers/banner/banner.component";
import { BannerListComponent } from "./components/banner-list/banner-list.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import {
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatTableModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { BannerFormComponent } from "./components/banner-form/banner-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/app/shared/shared.module";
import { BannerService } from "@app/app/banner/services/banner.service";
import { BannerDisplayComponent } from "@app/app/banner/components/banner-display/banner-display.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/banner/list" },
  {
    path: "",
    component: BannerComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "list",
        component: BannerListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    BannerComponent,
    BannerListComponent,
    BannerFormComponent,
    BannerDisplayComponent
  ],
  entryComponents: [BannerFormComponent],
  providers: [BannerService],
  exports: [RouterModule]
})
export class BannerModule {}
