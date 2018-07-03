import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IQuery } from "@editor/app/editor/models/query.model";
import { BehaviorSubject, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { firestore } from "firebase/app";
import { UserService } from "@editor/app/auth/services/user.service";
import {
  parseArticle,
  IArticle
} from "@editor/app/editor/models/article.model";

const ArticlesCollection = "articles";

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  className = "[Articles]";
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  query$: BehaviorSubject<IQuery> = new BehaviorSubject<IQuery>({
    fromDate: new Date().setHours(0, 0, 0, 0),
    range: "day"
  });
  selected$: BehaviorSubject<IArticle> = new BehaviorSubject<IArticle>(null);
  list$: BehaviorSubject<IArticle[]> = new BehaviorSubject<IArticle[]>(null);
  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService
  ) {
    this.query$
      .pipe(
        switchMap((query: IQuery) => {
          this.loading$.next(true);
          return this.afFirestore
            .collection(ArticlesCollection, ref => {
              let combRef:
                | firestore.CollectionReference
                | firestore.Query = ref;
              console.log(this.className + " new query", query);
              if (this.user.isManager && query.creatorId) {
                combRef =
                  query.creatorId === "ALLEDITOR"
                    ? combRef
                    : combRef.where("creatorId", "==", query.creatorId);
              } else {
                query.creatorId || this.user.authData.id;
              }
              combRef = query.status
                ? combRef.where("status", "==", query.status)
                : combRef;
              combRef = combRef.orderBy("publishAt", "desc");
              let range =
                !query.range || query.range === "day"
                  ? 86400000
                  : 86400000 * 30;
              return combRef
                .startAt(query.fromDate + range)
                .endAt(query.fromDate);
            })
            .snapshotChanges();
        }),
        map(snap => {
          this.loading$.next(false);
          return snap.length > 0
            ? snap.map(doc =>
                parseArticle(doc.payload.doc.id, doc.payload.doc.data())
              )
            : null;
        }),
        catchError(error => {
          console.log(this.className + " error", error);
          return of(error);
        })
      )
      .subscribe(
        articles => this.list$.next(articles),
        error => this.error$.next(error)
      );
  }

  setQuery(query: IQuery) {
    this.loading$.next(true);
    this.query$.next(query);
  }

  setSelected = (article: IArticle) => this.selected$.next(article);

  create = (article: IArticle) =>
    this.afFirestore.collection(ArticlesCollection).add(article);

  update = (article: IArticle) =>
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(article.id)
      .update(article);

  delete = (id: string) =>
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .delete();
}
