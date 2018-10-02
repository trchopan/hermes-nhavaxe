import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TagResultsComponent } from "./components/tag-results/tag-results.component";
import { TagsComponent } from "./containers/tags/tags.component";
import {
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatListModule,
  MatDividerModule,
  MatInputModule,
  MatButtonModule
} from "@angular/material";
import { TagService } from "@app/app/tags/services/tag.service";
import { TagsListComponent } from "@app/app/tags/containers/tags-list/tags-list.component";
import { TagsSearchComponent } from "@app/app/tags/containers/tags-search/tags-search.component";
import { TagsIdComponent } from "@app/app/tags/containers/tags-id/tags-id.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/tags/list" },
  {
    path: "",
    component: TagsComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "list",
        component: TagsListComponent
      },
      {
        path: "search",
        component: TagsSearchComponent
      },
      {
        path: "id",
        component: TagsIdComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
  ],
  declarations: [
    TagsListComponent,
    TagsSearchComponent,
    TagResultsComponent,
    TagsComponent,
    TagsIdComponent
  ],
  exports: [RouterModule]
})
export class TagsModule {}
