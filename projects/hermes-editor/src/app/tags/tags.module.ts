import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { TagsListComponent } from "@editor/app/tags/containers/tags-list/tags-list.component";
import { AuthGuardService } from "@editor/app/auth/services/auth-guard.service";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MatChipsModule,
  MatIconModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatListModule,
  MatDividerModule
} from "@angular/material";
import { TagsSearchComponent } from "@editor/app/tags/containers/tags-search/tags-search.component";
import { TagResultsComponent } from "./components/tag-results/tag-results.component";

const routes: Routes = [
  {
    path: "tags",
    component: TagsSearchComponent,
    canActivate: [AuthGuardService]
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
    MatListModule,
    MatDividerModule
  ],
  declarations: [TagsListComponent, TagsSearchComponent, TagResultsComponent]
})
export class TagsModule {}
