import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "@app/app/core/containers/page-not-found/page-not-found.component";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "@app/app/core/containers/app/app.component";
import { LoginLoadingComponent } from "@app/app/core/components/login-loading/login-loading.component";
import {
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule
} from "@angular/material";
import { LoadingSpinnerComponent } from "@app/app/core/components/loading-spinner/loading-spinner.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/article" },
  { path: "tags", loadChildren: "../tags/tags.module#TagsModule" },
  { path: "prices", loadChildren: "../prices/prices.module#PricesModule" },
  { path: "banner", loadChildren: "../banner/banner.module#BannerModule" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginLoadingComponent,
    LoadingSpinnerComponent
  ],
  exports: [RouterModule]
})
export class CoreModule {}
