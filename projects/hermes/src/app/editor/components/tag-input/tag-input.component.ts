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
import { map } from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";

@Component({
  selector: "hm-tag-input",
  templateUrl: "./tag-input.component.html",
  styleUrls: ["./tag-input.component.scss"]
})
export class TagInputComponent implements OnInit {
  @Input("selectedTags")
  set tagListSetter(selectedTags: string[]) {
    this.tagControl.setValue(selectedTags);
    this.tagData = selectedTags;
  }
  @Output()
  outputTags = new EventEmitter();

  tagData: string[] = [];
  tagControl = new FormControl();
  filteredTags$: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("tagInput")
  tagInput: ElementRef;

  constructor(public tagService: TagService) {}

  ngOnInit() {
    this.filteredTags$ = combineLatest(
      this.tagControl.valueChanges,
      this.tagService.list$
    ).pipe(
      map(([tagValue, tagList]) => {
        this.tagControl.setErrors(null);
        return tagValue
          ? tagList.filter(x => x.indexOf(tagValue) >= 0)
          : tagList.slice();
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
    this.tagControl.setValue(null);
    this.outputTags.emit(this.tagData);
  }

  add(event: MatChipInputEvent): void {
    this.tagControl.setErrors({ mustSelect: true });
    this.tagControl.setValue(null);
  }
}
