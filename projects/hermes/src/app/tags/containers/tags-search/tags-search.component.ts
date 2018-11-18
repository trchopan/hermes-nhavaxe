import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest, BehaviorSubject, of } from "rxjs";
import {
  map,
  switchMap,
  distinctUntilChanged,
  debounceTime
} from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { IArticle } from "@app/app/editor/models/article.model";
import { ITag } from "../../models/tag.model";

@Component({
  selector: "hm-tags-search",
  templateUrl: "./tags-search.component.html",
  styleUrls: ["./tags-search.component.scss"]
})
export class TagsSearchComponent implements OnInit {
  tagInputControl = new FormControl();
  selectedTags$: BehaviorSubject<string[]>;
  filteredTags$: Observable<ITag[]>;
  resultArticles$: Observable<{ article: IArticle; relevant: number }[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("tagInput")
  tagInput: ElementRef;

  constructor(public tags: TagService) {
    this.selectedTags$ = new BehaviorSubject([]);
  }

  ngOnInit() {
    this.filteredTags$ = this.tags.getFilteredTags(
      this.tagInputControl.valueChanges
    );

    this.resultArticles$ = this.selectedTags$.pipe(
      switchMap(tags =>
        combineLatest(tags.map(tag => this.tags.searchTag(tag))).pipe(
          map(combined => {
            let articles = combined
              .reduce((acc, cur) => acc.concat(cur), []) // flat it
              .sort((a, b) => {
                if (a.article.id >= b.article.id) {
                  return -1;
                } else {
                  return 1;
                }
              })
              .reduce((acc, cur) => {
                if (
                  acc.length <= 0 ||
                  acc[acc.length - 1].article.id !== cur.article.id
                ) {
                  acc.push(cur);
                } else {
                  acc[acc.length - 1].relevant++;
                }
                return acc;
              }, [])
              .sort((a, b) => b.article.publishAt - a.article.publishAt)
              .sort((a, b) => b.relevant - a.relevant)
              .map(x => x.article)

            return articles;
          })
        )
      )
    );
  }

  remove(tag: string): void {
    const index = this.selectedTags$.value.indexOf(tag);
    if (index >= 0) {
      const newSelectedTag = this.selectedTags$.value;
      newSelectedTag.splice(index, 1);
      this.selectedTags$.next(newSelectedTag);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedTags = this.selectedTags$.value;
    this.selectedTags$.next(selectedTags.concat(event.option.viewValue));
    this.tagInput.nativeElement.value = "";
    this.tagInputControl.setValue(null);
    this.tagInputControl.setErrors(null);
  }

  add(event: MatChipInputEvent): void {
    this.tagInputControl.setErrors({ mustSelect: true });
  }
}
