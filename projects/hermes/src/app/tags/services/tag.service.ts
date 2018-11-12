import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, of, Observable, combineLatest } from "rxjs";
import {
  map,
  tap,
  catchError,
  distinctUntilChanged,
  debounceTime
} from "rxjs/operators";
import { IArticle, parseArticle } from "@app/app/editor/models/article.model";
import { LayoutService } from "@app/app/core/services/layout.service";
import { normalizeText, logger, error } from "@app/app/shared/helpers";
import { ITag } from "../models/tag.model";

const ArticleCollection = "articles";
const TagsCollection = "tags";
const TagListDoc = "tagList";

@Injectable({ providedIn: "root" })
export class TagService {
  private className = "[Tags]";
  private log = logger(this.className);
  private error = error(this.className);

  list$: BehaviorSubject<ITag[]>;
  cloud$: BehaviorSubject<ITag[]>;
  blacklist$: BehaviorSubject<ITag[]>;

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.list$ = new BehaviorSubject([]);
    this.cloud$ = new BehaviorSubject([]);
    this.blacklist$ = new BehaviorSubject([]);

    this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .valueChanges()
      .pipe(
        map((value: { list: string[] }) =>
          value.list && value.list.length > 0
            ? value.list.map(x => ({
                text: x,
                norm: normalizeText(x),
                relevant: 1
              }))
            : []
        ),
        tap(value => this.log("list", value.length)),
        catchError(err => {
          this.error(err);
          return of([]);
        })
      )
      .subscribe(list => this.list$.next(list));

    this.afFirestore
      .collection(ArticleCollection, ref =>
        ref
          .where("status", "==", "published")
          .orderBy("publishAt", "desc")
          .endBefore(Date.now() - 1000 * 60 * 60 * 24 * 3)
      )
      .valueChanges()
      .pipe(
        map((values: IArticle[]) => {
          this.log("week tags", values.length);
          let result = values
            .map(x => {
              return x.tags
                ? x.tags.map((y, i) => ({
                    text: y,
                    norm: x.tagsNorm ? x.tagsNorm[i] : normalizeText(y),
                    relevant: 1
                  }))
                : [];
            })
            .reduce((acc, cur) => acc.concat(cur), new Array<ITag>())
            .sort((a, b) => (a.norm >= b.norm ? 1 : -1))
            .reduce((acc, cur) => {
              if (acc.length <= 0 || acc[acc.length - 1].norm !== cur.norm) {
                acc.push(cur);
              } else {
                acc[acc.length - 1].relevant++;
              }
              return acc;
            }, new Array<ITag>())
            .sort((a, b) => b.relevant - a.relevant);
          return result;
        }),
        catchError(err => {
          this.error(err);
          return of([]);
        })
      )
      .subscribe(cloud => this.cloud$.next(cloud));

    this.afFirestore
      .collection(TagsCollection)
      .doc("blacklist")
      .valueChanges()
      .pipe(
        map((value: any) => {
          if (value && value.blacklist) {
            return value.blacklist as ITag[];
          } else {
            return [];
          }
        }),
        catchError(err => {
          this.error(err);
          return of([]);
        })
      )
      .subscribe(blacklist => this.blacklist$.next(blacklist));
  }

  addTag = async (tag: string) => {
    if (this.list$.value.find(x => x.norm === normalizeText(tag))) {
      this.layout.snackWarning("Tag đã có trong danh sách");
      return;
    }
    try {
      let list = this.list$.value.map(x => x.text);
      list.push(tag);
      list = list.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });
      await this.updateTag(list);
      this.layout.snackSuccess(`Tag "${tag}" đã được thêm`);
      this.log("tag added", tag);
      return true;
    } catch (_) {
      return false;
    }
  };

  removeTag = async (tag: string) => {
    try {
      let list = this.list$.value.filter(x => x.norm !== normalizeText(tag));
      await this.updateTag(list.map(x => x.text));
      this.layout.snackSuccess(`Tag "${tag}" đã được xoá`);
      this.log("tag removed", tag);
      return true;
    } catch (_) {
      return false;
    }
  };

  updateTag = (tags: string[]) =>
    this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .set({ list: tags })
      .catch(err => {
        this.error(err);
        throw err;
      });

  searchTag = (tag: string) =>
    this.afFirestore
      .collection<IArticle>(ArticleCollection, ref =>
        ref
          .where("status", "==", "published")
          .where("tagsNorm", "array-contains", normalizeText(tag))
          .orderBy("publishAt", "desc")
          .limit(10)
      )
      .snapshotChanges()
      .pipe(
        map(snapshot =>
          snapshot.map(snap => ({
            article: parseArticle(snap.payload.doc.id, snap.payload.doc.data()),
            relevant: 1
          }))
        )
      );

  getFilteredTags = (inputControl: Observable<string>) =>
    combineLatest(this.list$, inputControl).pipe(
      distinctUntilChanged(),
      debounceTime(300),
      map(([list, tagInput]) => {
        let tag = normalizeText(tagInput);
        return list
          .filter(x => x.norm.indexOf(tag) >= 0)
          .sort((a, b) => a.norm.indexOf(tag) - b.norm.indexOf(tag));
      })
    );

  updateCloud = async (data: { cloud: ITag[]; blackList: ITag[] }) => {
    try {
      await this.afFirestore
        .collection(TagsCollection)
        .doc("cloud")
        .set({ cloud: data.cloud, timeStamp: Date.now() });
      await this.afFirestore
        .collection(TagsCollection)
        .doc("blacklist")
        .set({ blacklist: data.blackList });
      this.log("cloud updated");
      this.layout.snackSuccess("Tag Cloud đã được cập nhật");
      return true;
    } catch (err) {
      this.error(err);
      this.layout.snackWarning("Lỗi cập nhật Tag Cloud");
      return false;
    }
  };
}
