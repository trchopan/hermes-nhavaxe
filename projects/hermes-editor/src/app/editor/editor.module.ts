import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "./containers/create/create.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "../auth/services/auth-guard.service";
import { EditComponent } from "./containers/edit/edit.component";
import { ArticlesListComponent } from "./containers/articles-list/articles-list.component";
import { ArticleListItemComponent } from "./components/article-list-item/article-list-item.component";
import {
  MatListModule,
  MatButtonModule,
  MatSnackBarModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatRadioModule,
  MatCardModule,
  MatInputModule,
  MatPaginatorModule,
  MatTabsModule
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";
import { PreviewComponent } from "./containers/preview/preview.component";
import { ArticleDetailComponent } from "./components/article-detail/article-detail.component";
import { ArticleFormComponent } from "./components/article-form/article-form.component";
import { SharedModule } from "@editor/app/shared/shared.module";
import { QuillModule } from "ngx-quill";

const routes: Routes = [
  {
    path: "create",
    component: CreateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "edit",
    component: EditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "preview",
    component: PreviewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "list",
    component: ArticlesListComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    QuillModule,
    SharedModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  declarations: [
    CreateComponent,
    EditComponent,
    ArticleFormComponent,
    ArticlesListComponent,
    ArticleListItemComponent,
    PreviewComponent,
    ArticleDetailComponent
  ],
  exports: [RouterModule]
})
export class EditorModule {}
