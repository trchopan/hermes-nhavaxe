import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule, MatInputModule } from "@angular/material";
import { LeagueImagePipe } from "@editor/app/shared/pipes/league-image.pipe";
import { LeagueProcessPipe } from "@editor/app/shared/pipes/league-process.pipe";
import { LeagueTextPipe } from "@editor/app/shared/pipes/league-text.pipe";
import { DateTimePickerComponent } from "@editor/app/shared/components/date-time-picker/date-time-picker.component";
import { PublishAtLabelComponent } from "@editor/app/shared/components/publish-at-label/publish-at-label.component";

const SHARED_LIST = [
  LeagueImagePipe,
  LeagueProcessPipe,
  LeagueTextPipe,
  DateTimePickerComponent,
  PublishAtLabelComponent
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatInputModule],
  declarations: SHARED_LIST,
  exports: SHARED_LIST
})
export class SharedModule {}
