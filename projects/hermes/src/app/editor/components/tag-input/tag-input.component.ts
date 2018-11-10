import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest } from "rxjs";
import { map, distinctUntilChanged, debounceTime } from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { normalizeText } from "@app/app/shared/helpers";
import { ITag } from "@app/app/tags/models/tag.model";

@Component({
  selector: "hm-tag-input",
  templateUrl: "./tag-input.component.html",
  styleUrls: ["./tag-input.component.scss"]
})
export class TagInputComponent implements OnInit {
  @Input("selectedTags")
  set tagListSetter(selectedTags: string[]) {
    this.tagInputControl.setValue(selectedTags);
    this.tagData = selectedTags;
  }
  @Output()
  outputTags = new EventEmitter();

  tagData: string[] = [];
  tagInputControl = new FormControl();
  filteredTags$: Observable<ITag[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("tagInput")
  tagInput: ElementRef;

  constructor(public tags: TagService) {}

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
          x => x.norm.indexOf(tag.trim().toLowerCase()) >= 0
        );
      })
    );
  }

  remove(tag: string): void {
    const index = this.tagData.indexOf(tag);

    if (index >= 0) {
      this.tagData.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("selected", event.option.viewValue);
    this.tagData.push(event.option.viewValue);
    this.tagInput.nativeElement.value = "";
    this.tagInputControl.setValue("");
    this.outputTags.emit(this.tagData);
  }

  add(event: MatChipInputEvent): void {
    this.tagInputControl.setErrors({ mustSelect: true });
    this.tagInputControl.setValue("");
  }
}
