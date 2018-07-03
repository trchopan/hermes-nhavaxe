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
import { ICategory } from "@editor/app/editor/models/category.model";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

const ArticlesCollection = "articles";
const CategoriesCollection = "categories";

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
  list$: BehaviorSubject<IArticle[]> = new BehaviorSubject<IArticle[]>(null);
  categories$: BehaviorSubject<ICategory[]> = new BehaviorSubject<ICategory[]>(
    null
  );
  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.afFirestore
      .collection(CategoriesCollection)
      .snapshotChanges()
      .subscribe(snap => {
        let categories = snap.map(doc => {
          let data = doc.payload.doc.data() as { name: string };
          return { id: doc.payload.doc.id, name: data.name };
        });
        this.categories$.next(categories);
      });

    this.query$
      .pipe(
        switchMap((query: IQuery) =>
          this.afFirestore
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
                combRef = combRef.where(
                  "creatorId",
                  "==",
                  this.user.authData.id
                );
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
            .snapshotChanges()
        ),
        map(snap => {
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
        articles => {
          this.list$.next(articles);
          this.loading$.next(false);
        },
        error => {
          this.error$.next(error);
          this.loading$.next(false);
        }
      );
  }

  setQuery(query: IQuery) {
    this.loading$.next(true);
    this.query$.next(query);
  }

  create(article: IArticle) {
    this.loading$.next(true);
    console.log(this.className + " creating", this.loading$.value);
    this.afFirestore
      .collection(ArticlesCollection)
      .add(article)
      .then(() => this.handleSuccess())
      .catch(err => this.handleError(err));
  }

  update(article: IArticle) {
    this.loading$.next(true);
    console.log(this.className + " updating", this.loading$.value);
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(article.id)
      .update(article)
      .then(() => this.handleSuccess())
      .catch(err => this.handleError(err));
  }

  delete(id: string) {
    this.loading$.next(true);
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .delete()
      .then(() => this.handleSuccess())
      .catch(err => this.handleError(err));
  }

  handleSuccess() {
    this.router.navigate(["list"]);
    this.snackbar.open("Bài viết đã được cập nhật", null, {
      duration: 1000
    });
    this.loading$.next(false);
    console.log(this.className + " success");
  }

  handleError(err) {
    console.error(this.className + " error ", err);
    this.error$.next(err);
    this.snackbar.open("Lỗi cập nhật bài viết", null, {
      duration: 1000
    });
    this.loading$.next(false);
  }

  clearError = () => this.error$.next(null);

  isEditable = (status: string) =>
    status === "draft" || status === "pending" || this.user.isManager;
}
