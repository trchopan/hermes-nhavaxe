import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { IQuery } from "@app/app/editor/models/query.model";
import { BehaviorSubject, of, Observable } from "rxjs";
import { switchMap, map, catchError, tap } from "rxjs/operators";
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
import { logger, error } from "@app/app/shared/helpers";

const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";

@Injectable()
export class ArticlesService {
  private className = "[Aritlces]";
  private log = logger(this.className);
  private error = error(this.className);

  query$: BehaviorSubject<IQuery>;
  list$: BehaviorSubject<IArticle[] | null>;
  editorList$: BehaviorSubject<{ id: string; fullname: string }[]>;
  categories$: BehaviorSubject<ICategory[]>;

  constructor(
    private afFirestore: AngularFirestore,
    private user: UserService,
    private layout: LayoutService
  ) {
    this.query$ = new BehaviorSubject<IQuery>({
      fromDate: new Date().setHours(0, 0, 0, 0),
      range: "day",
      creatorId: this.user.authData.id,
      status: null
    });
    this.list$ = new BehaviorSubject(null);
    this.editorList$ = new BehaviorSubject(null);
    this.categories$ = new BehaviorSubject(null);

    this.afFirestore
      .collection<{ fullname: string }>("users", ref => ref.orderBy("fullname"))
      .snapshotChanges()
      .pipe(
        map(snapshots => {
          if (snapshots.length > 0) {
            let editors = snapshots.map(snap => ({
              id: snap.payload.doc.id,
              fullname: snap.payload.doc.data().fullname
            }));
            this.log("editors", editors);
            return editors;
          } else {
            this.log("no editor");
            return null;
          }
        }),
        catchError(err => {
          this.error(err);
          return of(null);
        })
      )
      .subscribe(result => this.editorList$.next(result));

    // Get the list of Categories
    this.afFirestore
      .collection(CategoriesCollection)
      .snapshotChanges()
      .pipe(
        map(snap => {
          if (snap.length > 0) {
            let categories = snap.map(doc =>
              parseCategory(doc.payload.doc.id, doc.payload.doc.data())
            );
            this.log("categories", categories);
            return categories;
          } else {
            this.log("no categories");
            return null;
          }
        }),
        catchError(err => {
          this.error(err);
          return of(null);
        })
      )
      .subscribe(result => this.categories$.next(result));

    // Get the list of Meta data
    this.query$
      .pipe(
        switchMap((query: IQuery) =>
          this.afFirestore
            .collection(ArticlesCollection, ref => {
              let range =
                !query.range || query.range === "day"
                  ? 86400000
                  : 86400000 * 30;

              let combRef: firestore.Query = ref
                .orderBy("publishAt", "desc")
                .startAt(query.fromDate + range)
                .endAt(query.fromDate);
              if (
                this.user.isManager &&
                query.creatorId &&
                query.creatorId !== "ALLEDITOR"
              ) {
                combRef = combRef.where("creatorId", "==", query.creatorId);
              }

              if (query.status) {
                combRef = combRef.where("status", "==", query.status);
              }

              return combRef;
            })
            .snapshotChanges()
        ),
        tap(() => this.layout.loading$.next(false)),
        map(snap => {
          if (snap.length > 0) {
            this.log("query found", snap.length);
            this.layout.snackDismiss();
            return snap.map(doc =>
              parseArticle(doc.payload.doc.id, doc.payload.doc.data())
            );
          }
          this.log("no result found");
          return null;
        }),
        catchError(err => {
          this.error(err);
          return of(null);
        })
      )
      .subscribe(result => this.list$.next(result));
  }

  getArticleData(id: string): Observable<IArticle> {
    this.layout.loading$.next(true);

    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          if (!snapshot.payload.exists) {
            return null;
          }
          this.log("found article", snapshot.payload.id);
          return parseArticle(snapshot.payload.id, snapshot.payload.data());
        }),
        tap(() => this.layout.loading$.next(false)),
        catchError(err => {
          this.error(err);
          return of(null);
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
          if (snapshot.length > 0) {
            this.log("found bodies", snapshot.length);
            return snapshot.map(snap =>
              parseArticleBody(snap.payload.doc.id, snap.payload.doc.data())
            );
          } else {
            this.layout.snackWarning("Không tìm thấy nội dung bài viết");
            return null;
          }
        }),
        tap(() => this.layout.loading$.next(false)),
        catchError(err => {
          this.error(err);
          return of(null);
        })
      );
  }

  setQuery(query: IQuery) {
    this.layout.loading$.next(true);
    this.query$.next(query);
    this.log("set query", query);
  }

  async create(article: IArticle): Promise<boolean> {
    this.layout.loading$.next(true);
    var body = article.bodyData;
    delete article.bodyData;
    try {
      let doc = await this.afFirestore
        .collection(ArticlesCollection)
        .add(article);
      if (body) {
        await doc.collection(BodyCollection).add(body);
      }
      this.log("created", doc.id);
      this.layout.snackSuccess("Bài viết đã được tạo");
      this.layout.loading$.next(false);
      return true;
    } catch (err) {
      this.error(err);
      this.layout.snackWarning("Lỗi tạo bài viết");
      this.layout.loading$.next(false);
      return false;
    }
  }

  async update(article: IArticle): Promise<boolean> {
    this.layout.loading$.next(true);
    const articleDoc = this.afFirestore
      .collection(ArticlesCollection)
      .doc(article.id);
    
    const body = article.bodyData;
    delete article.bodyData;

    const metaPromise = articleDoc.update(article);
    const bodyPromise = body
      ? articleDoc.collection(BodyCollection).add(body)
      : Promise.resolve(null);

    try {
      await Promise.all([metaPromise, bodyPromise]);
      this.log("updated", article.id);
      this.layout.snackSuccess("Bài viết đã được cập nhật");
      this.layout.loading$.next(false);
      return true;
    } catch (err) {
      this.error(err);
      this.layout.snackWarning("Lỗi cập nhật bài viết");
      this.layout.loading$.next(false);
      return false;
    }
  }

  isEditable = (status: string) =>
    status === "draft" || status === "pending" || this.user.isManager;
}
