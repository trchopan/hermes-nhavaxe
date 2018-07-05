import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AngularFireModule } from "angularfire2";
import { environment } from "@app/environments/environment";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AppRoutingModule } from "@app/app/app-routing.module";
import { ArticlesGridComponent } from "@app/app/components/articles-grid/articles-grid.component";
import { PageNotFoundComponent } from "@app/app/components/page-not-found/page-not-found.component";
import { ArticleDetailComponent } from "@app/app/components/article-detail/article-detail.component";
import { PublishAtParserPipe } from './pipes/publish-at-parser.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesGridComponent,
    ArticleDetailComponent,
    PageNotFoundComponent,
    PublishAtParserPipe
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
