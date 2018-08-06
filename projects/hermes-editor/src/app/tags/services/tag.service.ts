import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  IArticleTags,
  parseArticleTags
} from "@editor/app/tags/models/article-tags.model";

const ArticleTagsCollection = "article-tags";
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
      .collection<IArticleTags>(ArticleTagsCollection, ref =>
        ref
          .orderBy("publishAt", "desc")
          .where("tag", "==", tag)
          .limit(10)
      )
      .valueChanges()
      .pipe(map(tags => tags.map(tag => parseArticleTags(tag))));
  };
}
