import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, tap, share } from "rxjs/operators";
import { IArticle, parseArticle } from "@app/app/editor/models/article.model";
import { LayoutService } from "@app/app/core/services/layout.service";
import { normalizeText } from "@app/app/shared/helpers";

const ArticleCollection = "articles";
const TagsCollection = "tags";
const TagListDoc = "tagList";

interface ITagList {
  list: string[];
}

@Injectable({ providedIn: "root" })
export class TagService {
  private className = "[Tags] ";
  private _tagsList = [];

  list$: Observable<string[]>;

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.list$ = this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .valueChanges()
      .pipe(
        map((value: ITagList) =>
          value.list && value.list.length > 0 ? value.list : []
        ),
        tap(value => {
          console.log(this.className + " tag list", value.length);
          this._tagsList = value;
        }),
        share()
      );
  }

  addTag = async (tag: string) => {
    if (this._tagsList.find(x => normalizeText(x) === normalizeText(tag))) {
      this.layout.snackWarning("Tag đã có trong danh sách");
      return;
    }
    try {
      this._tagsList.push(tag);
      let newList = this._tagsList.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
      });
      await this.updateTag(newList);
      return true;
    } catch (_) {
      return false;
    }
  };

  removeTag = async (tag: string) => {
    try {
      let newList = this._tagsList.filter(x => x !== tag);
      await this.updateTag(newList);
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
      .then(() => this.layout.handleSuccess(this.className, "/tags"))
      .catch(err => {
        this.layout.handleError(this.className, "update", err);
        throw err;
      });

  searchTag = (tag: string) => {
    return this.afFirestore
      .collection<IArticle>(ArticleCollection, ref =>
        ref
          .where("status", "==", "published")
          .where("tags", "array-contains", tag)
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
