import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "@editor/app/core/containers/page-not-found/page-not-found.component";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "@editor/app/core/containers/app/app.component";
import { LoginLoadingComponent } from "@editor/app/core/components/login-loading/login-loading.component";
import {
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { LoadingSpinnerComponent } from '@editor/app/core/components/loading-spinner/loading-spinner.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/article" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginLoadingComponent,
    LoadingSpinnerComponent,
  ],
  exports: [RouterModule]
})
export class CoreModule {}
