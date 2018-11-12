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
import { Observable } from "rxjs";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { ITag } from "@app/app/tags/models/tag.model";
import { TagService } from "@app/app/tags/services/tag.service";

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

  constructor(public tag: TagService) {}

  ngOnInit() {
    this.filteredTags$ = this.tag.getFilteredTags(
      this.tagInputControl.valueChanges
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
