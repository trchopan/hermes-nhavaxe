import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, tap, share } from "rxjs/operators";
import { IArticle, parseArticle } from "@app/app/editor/models/article.model";
import { LayoutService } from "@app/app/core/services/layout.service";

const ArticleCollection = "articles";
const TagsCollection = "tags";
const TagListDoc = "tagList";

interface ITagList {
  list: string[];
}

@Injectable({ providedIn: "root" })
export class TagService {
  private className = "[Tags] ";

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
        map((value: ITagList) => (value ? value.list : [])),
        tap(value => console.log(this.className + " tag list", value.length)),
        share()
      );
  }

  updateTag = (tags: string[]) => {
    this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .set({ list: tags })
      .then(() => this.layout.handleSuccess(this.className, "/tags"))
      .catch(err => this.layout.handleError(this.className, "update", err));
  };

  searchTag = (tag: string) => {
    return this.afFirestore
      .collection<IArticle>(ArticleCollection, ref =>
        ref
          .where("status", "==", "published")
          .where("tags", "array-contains", tag)
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
