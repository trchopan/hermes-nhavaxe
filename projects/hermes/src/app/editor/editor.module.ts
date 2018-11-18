import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateComponent } from "@app/app/editor/containers/create/create.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import { EditComponent } from "@app/app/editor/containers/edit/edit.component";
import {
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatRadioModule,
  MatCardModule,
  MatInputModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatTooltipModule
} from "@angular/material";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ArticleDetailComponent } from "@app/app/editor/components/article-detail/article-detail.component";
import { ArticleFormComponent } from "@app/app/editor/components/article-form/article-form.component";
import { SharedModule } from "@app/app/shared/shared.module";
import { QuillModule } from "ngx-quill";
import { TagInputComponent } from "./components/tag-input/tag-input.component";
import { ArticlesService } from "./services/articles.service";
import { ArticleComponent } from './containers/article/article.component';
import { ArticlesSearchComponent } from "./containers/articles-search/articles-search.component";

const routes: Routes = [
  { path: "article", pathMatch: "full", redirectTo: "article/search" },
  {
    path: "article",
    component: ArticleComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "search", component: ArticlesSearchComponent },
      { path: "create", component: CreateComponent },
      { path: "edit/:id", component: EditComponent },
      { path: "preview/:id", component: ArticleDetailComponent },
      { path: "**", redirectTo: "search"}
    ]
  },

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
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  declarations: [
    ArticleComponent,
    ArticlesSearchComponent,
    CreateComponent,
    EditComponent,
    ArticleFormComponent,
    ArticleDetailComponent,
    TagInputComponent,
  ],
  providers: [ArticlesService],
  exports: [RouterModule]
})
export class EditorModule {}
