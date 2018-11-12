import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TagService } from "../../services/tag.service";
import { FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {
  MatAutocompleteSelectedEvent,
  MatChipInputEvent
} from "@angular/material";
import { ITag } from "../../models/tag.model";
import { map } from "rxjs/operators";
import { normalizeText } from "@app/app/shared/helpers";

@Component({
  selector: "hm-tags-cloud",
  templateUrl: "./tags-cloud.component.html",
  styleUrls: ["./tags-cloud.component.scss"]
})
export class TagsCloudComponent implements OnInit {
  filteredTags$: Observable<ITag[]>;
  blackListedCloud$: Observable<ITag[]>;
  tagInputControl = new FormControl();

  _blackList: ITag[];
  _cloud: ITag[];
  order: number[];

  constructor(public tag: TagService) {
    this.tagInputControl = new FormControl("");
    this.order = [
      14,
      13,
      12,
      11,
      10,
      9,
      8,
      7,
      6,
      3,
      1,
      0,
      2,
      4,
      5,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23
    ];
  }
  ngOnInit() {
    this.filteredTags$ = this.tag.getFilteredTags(
      this.tagInputControl.valueChanges
    );

    this.blackListedCloud$ = combineLatest(
      this.tag.blacklist$,
      this.tag.cloud$
    ).pipe(
      map(([blackList, cloud]) => {
        let result = this._filterBlackList(cloud, blackList);
        this._blackList = blackList;
        this._cloud = result;
        return result;
      })
    );
  }

  async add() {
    let foundTag = this.tag.list$.value.find(
      x => x.norm === normalizeText(this.tagInputControl.value)
    );
    if (!foundTag) {
      this.tagInputControl.setErrors({ notTag: true });
      return;
    } else if (this._blackList.findIndex(x => x.norm === foundTag.norm) > -1) {
      this.tagInputControl.setErrors({ blackListed: true });
      return;
    } else {
      this.tagInputControl.setValue("");
      this.tagInputControl.setErrors(null);
      let blacklist = this._blackList.concat(foundTag);
      await this.tag.updateCloud({
        cloud: this._filterBlackList(this._cloud, blacklist),
        blackList: blacklist
      });
    }
  }

  async remove(tag: ITag) {
    let blacklist = this._blackList.filter(x => x.norm !== tag.norm);
    await this.tag.updateCloud({
      cloud: this._filterBlackList(this._cloud, blacklist),
      blackList: blacklist
    });
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.tagInputControl.setValue(event.option.viewValue);
    this.add();
  }

  _filterBlackList(cloud: ITag[], blacklist: ITag[]) {
    return cloud.filter(x => !blacklist.find(y => y.norm === x.norm));
  }
}
