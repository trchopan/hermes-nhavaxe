import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { TagService } from "@editor/app/tags/services/tag.service";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { IArticleTags } from "@editor/app/tags/models/article-tags.model";

@Component({
  selector: "hm-editor-tag-input",
  templateUrl: "./tag-input.component.html",
  styleUrls: ["./tag-input.component.scss"]
})
export class TagInputComponent implements OnInit {
  @Input() tagList: string[];

  tagControl = new FormControl();
  filteredTags$: Observable<string[]>;
  resultArticles$: Observable<IArticleTags[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("tagInput") tagInput: ElementRef;

  constructor(public tagService: TagService) {}

  ngOnInit() {
    this.filteredTags$ = combineLatest(
      this.tagControl.valueChanges,
      this.tagService.list$
    ).pipe(
      map(
        ([tagValue, tagList]) =>
          tagValue
            ? tagList.filter(x => x.indexOf(tagValue) >= 0)
            : tagList.slice()
      )
    );
  }

  remove(tag: string): void {
    const index = this.tagList.indexOf(tag);

    if (index >= 0) {
      this.tagList.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("selected", event.option.viewValue);
    this.tagList.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagControl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;

    if (input) {
      input.value = "";
    }

    this.tagControl.setValue(null);
  }
}
