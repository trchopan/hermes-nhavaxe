import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, of } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";
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

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.list$ = new BehaviorSubject(null);
    this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .valueChanges()
      .pipe(
        map((value: any) =>
          value.list && value.list.length > 0 ? value.list : []
        ),
        tap((value: string[]) => {
          this.log("list", value.length);
          let list = value.map(x => ({ text: x, norm: normalizeText(x)}));
          this.list$.next(list);
        }),
        catchError(err => {
          this.error(err);
          return of([]);
        })
      )
      .subscribe();
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

  searchTag = (tag: string) => {
    return this.afFirestore
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
  };
}
