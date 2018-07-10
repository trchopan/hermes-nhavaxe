import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IQuery } from "@editor/app/editor/models/query.model";
import { BehaviorSubject, of, Observable } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { firestore } from "firebase/app";
import { UserService } from "@editor/app/auth/services/user.service";
import {
  ICategory,
  parseCategory
} from "@editor/app/editor/models/category.model";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import {
  IArticle,
  parseArticle,
  IArticleBody,
  parseArticleBody
} from "@editor/app/editor/models/article.model";

const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  private className = "[Articles] ";

  loading$: BehaviorSubject<boolean>;
  query$: BehaviorSubject<IQuery>;
  list$: BehaviorSubject<IArticle[]>;
  categories$: BehaviorSubject<ICategory[]>;
  error$: BehaviorSubject<string>;

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.loading$ = new BehaviorSubject<boolean>(true);
    this.list$ = new BehaviorSubject<IArticle[]>(null);
    this.query$ = new BehaviorSubject<IQuery>({
      fromDate: new Date().setHours(0, 0, 0, 0),
      range: "day"
    });
    this.categories$ = new BehaviorSubject<ICategory[]>(null);
    this.error$ = new BehaviorSubject<string>(null);

    // Get the list of Categories
    this.afFirestore
      .collection(CategoriesCollection)
      .snapshotChanges()
      .subscribe(snap => {
        let categories = snap.map(doc =>
          parseCategory(doc.payload.doc.id, doc.payload.doc.data())
        );
        this.categories$.next(categories);
      });

    // Get the list of Meta data
    this.query$
      .pipe(
        switchMap((query: IQuery) =>
          this.afFirestore
            .collection(ArticlesCollection, ref => {
              let combRef:
                | firestore.CollectionReference
                | firestore.Query = ref;
              console.log(this.className + "current query", query);
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
        map(
          snap =>
            snap.length > 0
              ? snap.map(doc =>
                  parseArticle(doc.payload.doc.id, doc.payload.doc.data())
                )
              : null
        ),
        catchError(error => {
          console.log(this.className + "error", error);
          return of(error);
        })
      )
      .subscribe(
        (articles: IArticle[]) => {
          this.list$.next(articles);
          this.loading$.next(false);
        },
        error => {
          this.error$.next(error);
          this.loading$.next(false);
        }
      );
  }

  getArticleData = (id: string): Observable<IArticle> =>
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .valueChanges()
      .pipe(map(value => parseArticle(id, value)));

  getBodyData = (id: string): Observable<IArticleBody> =>
    this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .collection(BodyCollection, ref =>
        ref.orderBy("modifiedAt", "desc").limit(1)
      )
      .valueChanges()
      .pipe(map(snap => (snap.length > 0 ? parseArticleBody(snap[0]) : null)));

  setQuery(query: IQuery) {
    this.loading$.next(true);
    this.query$.next(query);
  }

  create(article: IArticle) {
    this.loading$.next(true);
    console.log(this.className + " creating", this.loading$.value);
    var newArticle = { ...article, bodyData: "" } 
    this.afFirestore
      .collection(ArticlesCollection)
      .add(newArticle)
      .then(doc =>
        doc
          .collection(BodyCollection)
          .add(article.bodyData)
          .then(() => this.handleSuccess())
      )
      .catch(err => this.handleError("creating", err));
  }

  update(article: IArticle) {
    this.loading$.next(true);
    console.log(this.className + " updating", this.loading$.value);
    const articleDoc = this.afFirestore
      .collection(ArticlesCollection)
      .doc(article.id);

    const metaPromise = articleDoc.update({
      ...article,
      bodyData: firestore.FieldValue.delete()
    });
    const bodyPromise = article.bodyData
      ? articleDoc.collection(BodyCollection).add(article.bodyData)
      : Promise.resolve(null);

    Promise.all([metaPromise, bodyPromise])
      .then(() => this.handleSuccess())
      .catch(err => this.handleError("updating", err));
  }

  handleSuccess() {
    this.router.navigate(["list"]);
    this.snackbar.open("Bài viết đã được cập nhật", null, {
      duration: 1000
    });
    this.loading$.next(false);
    console.log(this.className + " success");
  }

  handleError(operation: string, err: any) {
    console.error(this.className + operation + " error ", err);
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
