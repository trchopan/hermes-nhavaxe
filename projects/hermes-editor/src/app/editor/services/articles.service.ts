import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IQuery } from "@editor/app/editor/models/query.model";
import { BehaviorSubject, of, Observable } from "rxjs";
import { switchMap, map, catchError, tap } from "rxjs/operators";
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
import { LayoutService } from "@editor/app/core/services/layout.service";

const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  private className = "[Articles] ";
  
  statusMap = [
    { value: "draft", text: "Đang soạn"},
    { value: "pending", text: "Chờ duyệt"},
    { value: "published", text: "Đã duyệt"},
    { value: "unpublished", text: "Gở bỏ"},
  ]

  query$: BehaviorSubject<IQuery>;
  list$: BehaviorSubject<IArticle[]>;
  categories$: BehaviorSubject<ICategory[]>;
  error$: BehaviorSubject<string>;

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService,
    private router: Router,
    private snackbar: MatSnackBar,
    private layout: LayoutService
  ) {
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
        tap(() => this.layout.loading$.next(true)),
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
          this.layout.loading$.next(false);
        },
        error => {
          this.error$.next(error);
          this.layout.loading$.next(false);
        }
      );
  }

  getArticleData(id: string): Observable<IArticle> {
    this.layout.loading$.next(true);
    console.log(this.className + "get article data " + id);

    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .valueChanges()
      .pipe(
        map(result => {
          this.layout.loading$.next(false);
          return parseArticle(id, result);
        }),
        catchError(err => {
          console.log(this.className + "getting article data error", err);
          return of(err);
        })
      );
  }

  getBodyData(id: string): Observable<IArticleBody> {
    this.layout.loading$.next(true);
    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .collection(BodyCollection, ref =>
        ref.orderBy("modifiedAt", "desc").limit(1)
      )
      .valueChanges()
      .pipe(
        map(snap => {
          console.log(this.className + "get article body " + id);
          this.layout.loading$.next(false);
          return snap.length > 0 ? parseArticleBody(snap[0]) : null;
        }),
        catchError(err => {
          console.log(this.className + "getting article body error", err);
          return of(err);
        })
      );
  }

  setQuery(query: IQuery) {
    this.layout.loading$.next(true);
    this.query$.next(query);
  }

  create(article: IArticle) {
    this.layout.loading$.next(true);
    console.log(this.className + " creating");
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
    this.layout.loading$.next(true);
    console.log(this.className + " updating");
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
    this.router.navigate(["article"]);
    this.snackbar.open("Bài viết đã được cập nhật", null, {
      duration: 1000
    });
    this.layout.loading$.next(false);
    console.log(this.className + " success");
  }

  handleError(operation: string, err: any) {
    console.error(this.className + operation + " error ", err);
    this.error$.next(err);
    this.snackbar.open("Lỗi cập nhật bài viết", null, {
      duration: 1000
    });
    this.layout.loading$.next(false);
  }

  clearError = () => this.error$.next(null);

  isEditable = (status: string) =>
    status === "draft" || status === "pending" || this.user.isManager;
}
