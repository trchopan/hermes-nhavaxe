import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "@editor/app/editor/containers/create/create.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@editor/app/auth/services/auth-guard.service";
import { EditComponent } from "@editor/app/editor/containers/edit/edit.component";
import { ArticlesListComponent } from "@editor/app/editor/containers/articles-list/articles-list.component";
import { ArticleListItemComponent } from "@editor/app/editor/components/article-list-item/article-list-item.component";
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
  MatTabsModule,
  MatChipsModule,
  MatAutocompleteModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ArticleDetailComponent } from "@editor/app/editor/components/article-detail/article-detail.component";
import { ArticleFormComponent } from "@editor/app/editor/components/article-form/article-form.component";
import { SharedModule } from "@editor/app/shared/shared.module";
import { QuillModule } from "ngx-quill";
import { TagInputComponent } from './components/tag-input/tag-input.component';

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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule
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
