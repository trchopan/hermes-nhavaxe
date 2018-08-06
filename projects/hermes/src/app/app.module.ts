import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "@app/app/app.component";
import { AngularFireModule } from "angularfire2";
import { environment } from "@app/environments/environment";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AppRoutingModule } from "@app/app/app-routing.module";
import { ArticlesGridComponent } from "@app/app/components/articles-grid/articles-grid.component";
import { PageNotFoundComponent } from "@app/app/components/page-not-found/page-not-found.component";
import { ArticleDetailComponent } from "@app/app/components/article-detail/article-detail.component";
import { PublishAtParserPipe } from "@app/app/pipes/publish-at-parser.pipe";
import { ArticlesGridTopComponent } from "@app/app/components/articles-grid-top/articles-grid-top.component";
import { NavbarCategoriesComponent } from "@app/app/components/navbar-categories/navbar-categories.component";
import { LoadingBarComponent } from "@app/app/components/loading-bar/loading-bar.component";
import { TrimTextPipe } from "@app/app/pipes/trim-text.pipe";
import { ArticlesGridListComponent } from "@app/app/components/articles-grid-list/articles-grid-list.component";

@NgModule({
  declarations: [
    AppComponent,
    PublishAtParserPipe,
    TrimTextPipe,
    PageNotFoundComponent,
    ArticleDetailComponent,
    ArticlesGridComponent,
    ArticlesGridTopComponent,
    ArticlesGridListComponent,
    NavbarCategoriesComponent,
    LoadingBarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
