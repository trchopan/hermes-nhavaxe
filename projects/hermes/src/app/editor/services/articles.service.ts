import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { IQuery } from "@app/app/editor/models/query.model";
import { BehaviorSubject, of, Observable } from "rxjs";
import { switchMap, map, catchError, tap, share } from "rxjs/operators";
import { firestore } from "firebase/app";
import { UserService } from "@app/app/auth/services/user.service";
import {
  ICategory,
  parseCategory
} from "@app/app/editor/models/category.model";
import {
  IArticle,
  parseArticle,
  IArticleBody,
  parseArticleBody
} from "@app/app/editor/models/article.model";
import { LayoutService } from "@app/app/core/services/layout.service";

const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  private className = "[Articles] ";

  statusMap = [
    { value: "draft", text: "Đang soạn" },
    { value: "pending", text: "Chờ duyệt" },
    { value: "published", text: "Đã duyệt" },
    { value: "unpublished", text: "Gở bỏ" }
  ];

  query$: BehaviorSubject<IQuery>;
  list$: BehaviorSubject<IArticle[]>;
  editorList$: Observable<{ id: string; fullname: string }[]>;
  categories$: Observable<ICategory[]>;
  error$: BehaviorSubject<any>;

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService,
    private layout: LayoutService
  ) {
    this.list$ = new BehaviorSubject<IArticle[]>(null);
    this.query$ = new BehaviorSubject<IQuery>({
      fromDate: new Date().setHours(0, 0, 0, 0),
      range: "day"
    });
    this.error$ = new BehaviorSubject(null);

    this.editorList$ = this.getEditorList();

    // Get the list of Categories
    this.categories$ = this.afFirestore
      .collection(CategoriesCollection)
      .snapshotChanges()
      .pipe(
        map(snap =>
          snap.map(doc =>
            parseCategory(doc.payload.doc.id, doc.payload.doc.data())
          )
        )
      );

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

  getEditorList = () =>
    this.afFirestore
      .collection("users", ref => ref.orderBy("fullname"))
      .snapshotChanges()
      .pipe(
        map(snapshots => {
          if (snapshots.length > 0) {
            return snapshots.map(snap => {
              let doc = snap.payload.doc;
              let data = doc.data() as { fullname: string };
              return {
                id: doc.id,
                fullname: data.fullname
              };
            });
          } else {
            return null;
          }
        }),
        tap(editors => console.log(this.className + " editors", editors)),
        share()
      );

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

  getBodyData(id: string): Observable<IArticleBody[]> {
    this.layout.loading$.next(true);
    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .collection(BodyCollection, ref => ref.orderBy("modifiedAt", "desc"))
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          console.log(this.className + "get article body " + id);
          this.layout.loading$.next(false);
          return snapshot.length > 0
            ? snapshot.map(snap =>
                parseArticleBody(snap.payload.doc.id, snap.payload.doc.data())
              )
            : null;
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
    var body = article.bodyData;
    delete article.bodyData;
    this.afFirestore
      .collection(ArticlesCollection)
      .add(article)
      .then(
        doc =>
          body
            ? doc
                .collection(BodyCollection)
                .add(body)
                .then(() =>
                  this.layout.handleSuccess(this.className, "/article")
                )
            : this.layout.handleSuccess(this.className, "/article")
      )
      .catch(err => this.layout.handleError(this.className, "creating", err));
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
      .then(() => this.layout.handleSuccess(this.className, "/article"))
      .catch(err => this.layout.handleError(this.className, "updating", err));
  }

  isEditable = (status: string) =>
    status === "draft" || status === "pending" || this.user.isManager;
}
