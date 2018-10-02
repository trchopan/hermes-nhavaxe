import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { TagService } from "@app/app/tags/services/tag.service";
import { Observable, combineLatest, BehaviorSubject, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent
} from "@angular/material";
import { IArticle } from "@app/app/editor/models/article.model";

@Component({
  selector: "hm-tags-search",
  templateUrl: "./tags-search.component.html",
  styleUrls: ["./tags-search.component.scss"]
})
export class TagsSearchComponent implements OnInit {
  tagControl = new FormControl();
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
      this.tagControl.valueChanges,
      this.tags.list$
    ).pipe(
      map(([tagValue, tagList]) => {
        return tagValue
          ? tagList.filter(x => x.indexOf(tagValue) >= 0)
          : tagList.slice();
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
    console.log("removing", tag, this.selectedTags$.value);

    const index = this.selectedTags$.value.indexOf(tag);

    if (index >= 0) {
      const newSelectedTag = this.selectedTags$.value;
      newSelectedTag.splice(index, 1);
      this.selectedTags$.next(newSelectedTag);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log("selected", event.option.viewValue);
    const selectedTags = this.selectedTags$.value;
    this.selectedTags$.next(selectedTags.concat(event.option.viewValue));
    this.tagInput.nativeElement.value = "";
    this.tagControl.setValue(null);
    this.tagControl.setErrors(null);
  }

  add(event: MatChipInputEvent): void {
    this.tagControl.setErrors({ mustSelect: true });
    this.tagControl.setValue(null);
    console.log("does it error?", this.tagControl.hasError("mustSelect"));
  }
}
