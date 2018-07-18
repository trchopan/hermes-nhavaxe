import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArticlesGridComponent } from "@app/app/components/articles-grid/articles-grid.component";
import { PageNotFoundComponent } from "@app/app/components/page-not-found/page-not-found.component";
import { ArticleDetailComponent } from "@app/app/components/article-detail/article-detail.component";
import { ArticlesGridTopComponent } from "@app/app/components/articles-grid-top/articles-grid-top.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/article/" },
  { path: "article", pathMatch: "full", redirectTo: "/article/" },
  { path: "article/:id", component: ArticlesGridComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
