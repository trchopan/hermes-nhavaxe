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
  MatButtonModule,
  MatDialogModule
} from "@angular/material";
import { TagsListComponent } from "@app/app/tags/containers/tags-list/tags-list.component";
import { TagsSearchComponent } from "@app/app/tags/containers/tags-search/tags-search.component";
import { TagsIdComponent } from "@app/app/tags/containers/tags-id/tags-id.component";
import { TagsCloudComponent } from "./containers/tags-cloud/tags-cloud.component";

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
      },
      {
        path: "cloud",
        component: TagsCloudComponent
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
    MatDividerModule,
    MatDialogModule
  ],
  declarations: [
    TagsListComponent,
    TagsSearchComponent,
    TagResultsComponent,
    TagsComponent,
    TagsIdComponent,
    TagsCloudComponent
  ],
  exports: [RouterModule]
})
export class TagsModule {}
