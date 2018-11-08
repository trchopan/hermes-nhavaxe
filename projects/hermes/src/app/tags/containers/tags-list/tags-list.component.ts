import { Component, OnInit } from "@angular/core";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { map, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { normalizeText } from "@app/app/shared/helpers";

@Component({
  selector: "hm-tags-list",
  templateUrl: "./tags-list.component.html",
  styleUrls: ["./tags-list.component.scss"]
})
export class TagsListComponent implements OnInit {
  filteredTags$: Observable<string[]>;
  tagInputControl: FormControl;

  tagList: string[];

  constructor(public tags: TagService) {
    this.tagInputControl = new FormControl("", Validators.minLength(3));
  }

  ngOnInit() {
    this.filteredTags$ = combineLatest(
      this.tags.list$,
      this.tagInputControl.valueChanges
    ).pipe(
      distinctUntilChanged(),
      debounceTime(300),
      map(([list, tagInput]) => {
        let tag = normalizeText(tagInput);
        return list.filter(
          x => normalizeText(x).indexOf(tag.trim().toLowerCase()) >= 0
        );
      })
    );
  }

  async add() {
    if (this.tagInputControl.invalid) {
      return;
    }
    this.tagInputControl.disable();
    if (await this.tags.addTag(this.tagInputControl.value.toLowerCase())) {
      this.tagInputControl.setValue("");
    }
    this.tagInputControl.enable();
  }

  async remove(tag) {
    this.tagInputControl.disable();
    if (await this.tags.removeTag(tag)) {
      this.tagInputControl.setValue("");
    }
    this.tagInputControl.enable();
  }
}
