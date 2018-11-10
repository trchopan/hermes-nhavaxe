import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatSelectModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule
} from "@angular/material";
import { LeagueImagePipe } from "@app/app/shared/pipes/league-image.pipe";
import { LeagueProcessPipe } from "@app/app/shared/pipes/league-process.pipe";
import { LeagueTextPipe } from "@app/app/shared/pipes/league-text.pipe";
import { DateTimePickerComponent } from "@app/app/shared/components/date-time-picker/date-time-picker.component";
import { PublishAtLabelComponent } from "@app/app/shared/components/publish-at-label/publish-at-label.component";
import { FormatNewlineSplashPipe } from "@app/app/shared/pipes/format-newline-splash.pipe";
import { TrimTextPipe } from "@app/app/shared/pipes/trim-text.pipe";
import { DialogConfirmationComponent } from "./components/dialog-confirmation/dialog-confirmation.component";

const SHARED_LIST = [
  LeagueImagePipe,
  LeagueProcessPipe,
  LeagueTextPipe,
  TrimTextPipe,
  FormatNewlineSplashPipe,
  DateTimePickerComponent,
  PublishAtLabelComponent,
  DialogConfirmationComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule
  ],
  declarations: SHARED_LIST,
  entryComponents: [DialogConfirmationComponent],
  exports: SHARED_LIST
})
export class SharedModule {}
