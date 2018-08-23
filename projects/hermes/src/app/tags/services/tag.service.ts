import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import {
  IArticle,
  parseArticle
} from "@app/app/editor/models/article.model";

const ArticleCollection = "articles";
const TagsCollection = "tags";
const TagListDoc = "tagList";

interface ITagList {
  list: string[];
}

@Injectable({
  providedIn: "root"
})
export class TagService {
  private className = "[Tags] ";

  list$: Observable<string[]>;

  constructor(private afFirestore: AngularFirestore) {
    this.list$ = this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .valueChanges()
      .pipe(map((value: ITagList) => (value ? value.list : [])));
  }

  updateTag = (tags: string[]) => {
    this.afFirestore
      .collection(TagsCollection)
      .doc(TagListDoc)
      .set({ list: tags })
      .then(() => console.log("Tag List updated"))
      .catch(err => console.log("Tag List update errror", err));
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
