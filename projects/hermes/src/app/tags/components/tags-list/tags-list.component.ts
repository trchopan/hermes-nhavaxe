import { Component, OnInit } from "@angular/core";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, distinctUntilChanged, debounceTime } from "rxjs/operators";

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
    this.tagInputControl = new FormControl();
  }

  ngOnInit() {
    this.filteredTags$ = combineLatest(
      this.tagInputControl.valueChanges,
      this.tags.list$
    ).pipe(
      distinctUntilChanged(),
      debounceTime(300),
      map(([newTag, list]) => {
        this.tagList = list;
        this.tagInputControl.setErrors(null);
        return list.filter(x => x.indexOf(newTag.trim().toLowerCase()) >= 0);
      })
    );
  }

  add() {
    let newTag = this.tagInputControl.value || "";
    newTag = newTag.trim().toLowerCase();
    if (newTag) {
      this.tagList.push(newTag);
      this.tagList.sort();
      this.tags.updateTag(this.tagList);
      this.tagInputControl.setValue("");
    }
  }

  remove(tag) {
    let newList = this.tagList.filter(x => x !== tag);
    console.log(newList);
    this.tags.updateTag(newList);
    this.tagInputControl.setValue("");
  }
}
