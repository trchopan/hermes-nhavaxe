import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from "@app/app/auth/services/auth-guard.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TagResultsComponent } from "./components/tag-results/tag-results.component";
import { TagsComponent } from "./containers/tags/tags.component";
import { TagsListComponent } from "@app/app/tags/components/tags-list/tags-list.component";
import { TagsSearchComponent } from "@app/app/tags/components/tags-search/tags-search.component";
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
    TagsComponent
  ],
  exports: [RouterModule]
})
export class TagsModule {}
