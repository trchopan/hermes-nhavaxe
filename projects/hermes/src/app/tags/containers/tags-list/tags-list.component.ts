import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { map, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { normalizeText } from "@app/app/shared/helpers";
import { ITag } from "../../models/tag.model";
import { DialogConfirmationComponent } from "@app/app/shared/components/dialog-confirmation/dialog-confirmation.component";

@Component({
  selector: "hm-tags-list",
  templateUrl: "./tags-list.component.html",
  styleUrls: ["./tags-list.component.scss"]
})
export class TagsListComponent implements OnInit {
  filteredTags$: Observable<ITag[]>;
  tagInputControl: FormControl;

  tagList: string[];

  constructor(public tag: TagService, private dialog: MatDialog) {
    this.tagInputControl = new FormControl("", Validators.minLength(3));
  }

  ngOnInit() {
    this.filteredTags$ = this.tag.getFilteredTags(
      this.tagInputControl.valueChanges
    );
  }

  async add() {
    if (this.tagInputControl.invalid) {
      return;
    }
    this.tagInputControl.disable();
    let tag = this.tagInputControl.value;
    if (await this.tag.addTag(tag)) {
      this.tagInputControl.setValue("");
    }
    this.tagInputControl.enable();
  }

  openRemoveConfirmation(tag: string) {
    let dialogRef = this.dialog.open(DialogConfirmationComponent, {
      width: "80%",
      data: `Bạn có chắc chắn muốn xoá tag "${tag}"`
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.remove(tag);
      }
    });
  }

  async remove(tag: string) {
    this.tagInputControl.disable();
    if (await this.tag.removeTag(tag)) {
      this.tagInputControl.setValue("");
    }
    this.tagInputControl.enable();
  }
}
