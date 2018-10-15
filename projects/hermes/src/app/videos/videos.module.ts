import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { VideosComponent } from "./containers/videos/videos.component";
import { VidoesFormComponent } from "./components/vidoes-form/vidoes-form.component";
import { VidoesListComponent } from "./components/vidoes-list/vidoes-list.component";
import {
  MatListModule,
  MatButtonModule,
  MatPaginatorModule,
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatDialogModule
} from "@angular/material";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { VideosService } from "./services/videos.service";

const routes: Routes = [
  { path: "", pathMatch: "full", component: VideosComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  declarations: [VideosComponent, VidoesFormComponent, VidoesListComponent],
  entryComponents: [VidoesFormComponent],
  providers: [VideosService]
})
export class VideosModule {}
