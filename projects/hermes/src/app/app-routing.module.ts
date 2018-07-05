import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArticlesGridComponent } from "@app/app/components/articles-grid/articles-grid.component";
import { PageNotFoundComponent } from "@app/app/components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  { path: ":category/:id", component: ArticlesGridComponent },
  { path: ":id", component: ArticlesGridComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
