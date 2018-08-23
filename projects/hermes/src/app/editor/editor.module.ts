import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "@app/app/editor/containers/create/create.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import { EditComponent } from "@app/app/editor/containers/edit/edit.component";
import { ArticlesListComponent } from "@app/app/editor/containers/articles-list/articles-list.component";
import { ArticleListItemComponent } from "@app/app/editor/components/article-list-item/article-list-item.component";
import {
  MatListModule,
  MatButtonModule,
  MatSnackBarModule,
  MatSelectModule,
  MatIconModule,
  MatRadioModule,
  MatCardModule,
  MatInputModule,
  MatPaginatorModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatFormFieldModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ArticleDetailComponent } from "@app/app/editor/components/article-detail/article-detail.component";
import { ArticleFormComponent } from "@app/app/editor/components/article-form/article-form.component";
import { SharedModule } from "@app/app/shared/shared.module";
import { QuillModule } from "ngx-quill";
import { TagInputComponent } from "./components/tag-input/tag-input.component";

const routes: Routes = [
  {
    path: "article",
    component: ArticlesListComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "create", component: CreateComponent },
      { path: "edit/:id", component: EditComponent },
      { path: ":id", component: ArticleDetailComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
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
    MatPaginatorModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule
  ],
  declarations: [
    CreateComponent,
    EditComponent,
    ArticleFormComponent,
    ArticlesListComponent,
    ArticleListItemComponent,
    ArticleDetailComponent,
    TagInputComponent
  ],
  exports: [RouterModule]
})
export class EditorModule {}
