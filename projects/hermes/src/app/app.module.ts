import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "@app/environments/environment";

import { AppComponent } from "@app/app/core/containers/app/app.component";
import { AuthModule } from "@app/app/auth/auth.module";
import { CoreModule } from "@app/app/core/core.module";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { EditorModule } from "@app/app/editor/editor.module";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AuthModule,
    EditorModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
