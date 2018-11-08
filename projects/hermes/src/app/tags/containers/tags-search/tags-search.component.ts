import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest, BehaviorSubject, of } from "rxjs";
import { map, switchMap, distinctUntilChanged, debounceTime } from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { IArticle } from "@app/app/editor/models/article.model";
import { normalizeText } from "@app/app/shared/helpers";

@Component({
  selector: "hm-tags-search",
  templateUrl: "./tags-search.component.html",
  styleUrls: ["./tags-search.component.scss"]
})
export class TagsSearchComponent implements OnInit {
  tagInputControl = new FormControl();
  selectedTags$: BehaviorSubject<string[]>;
  filteredTags$: Observable<string[]>;
  resultArticles$: Observable<{ article: IArticle; relevant: number }[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("tagInput")
  tagInput: ElementRef;

  constructor(public tags: TagService) {
    this.selectedTags$ = new BehaviorSubject([]);
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

    this.resultArticles$ = this.selectedTags$.pipe(
      switchMap(tags =>
        // Combine all observables
        combineLatest(tags.map(tag => this.tags.searchTag(tag))).pipe(
          map(combined => {
            const result = combined
              .reduce((lastResult, nextResult) => {
                // Find the duplicate
                nextResult.forEach((result, i) => {
                  var foundDuplicate = lastResult.findIndex(
                    x => x.article.id === result.article.id
                  );
                  // If found increase the relevant amount
                  if (foundDuplicate >= 0) {
                    lastResult[foundDuplicate].relevant++;
                    nextResult[i] = null;
                  }
                });
                return [...lastResult, ...nextResult.filter(x => x !== null)];
              }, [])
              .sort((a, b) => b.article.publishAt - a.article.publishAt)
              .sort((a, b) => b.relevant - a.relevant);

            console.log("Search result", result);
            return result;
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
