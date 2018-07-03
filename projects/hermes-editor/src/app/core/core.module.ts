import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "./containers/page-not-found/page-not-found.component";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./containers/app/app.component";
import { LoginLoadingComponent } from "@editor/app/core/components/login-loading/login-loading.component";
import {
  MatButtonModule,
  MatIconModule,
  MatToolbarModule
} from "@angular/material";
import { MlToolbarComponent } from "@editor/app/core/components/ml-toolbar/ml-toolbar.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/list" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginLoadingComponent,
    MlToolbarComponent
  ],
  exports: [RouterModule]
})
export class CoreModule {}
