import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule
} from "@angular/material";
import { LeagueImagePipe } from "./pipes/league-image.pipe";
import { LeagueProcessPipe } from "./pipes/league-process.pipe";
import { LeagueTextPipe } from "./pipes/league-text.pipe";
import { DateTimePickerComponent } from "./components/date-time-picker/date-time-picker.component";
import { PublishAtLabelComponent } from "./components/publish-at-label/publish-at-label.component";
import { FormatNewlineSplashPipe } from "./pipes/format-newline-splash.pipe";
import { TrimTextPipe } from "./pipes/trim-text.pipe";
import { DialogConfirmationComponent } from "./components/dialog-confirmation/dialog-confirmation.component";
import { ArticleListComponent } from "./components/article-list/article-list.component";

const SHARED_LIST = [
  LeagueImagePipe,
  LeagueProcessPipe,
  LeagueTextPipe,
  TrimTextPipe,
  FormatNewlineSplashPipe,
  DateTimePickerComponent,
  PublishAtLabelComponent,
  DialogConfirmationComponent,
  ArticleListComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule
  ],
  declarations: SHARED_LIST,
  entryComponents: [DialogConfirmationComponent],
  exports: SHARED_LIST
})
export class SharedModule {}
