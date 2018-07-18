import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { BehaviorSubject, Observable, of, combineLatest, merge } from "rxjs";
import {
  ICategory,
  parseCategory
} from "@editor/app/editor/models/category.model";
import {
  IArticle,
  parseArticle,
  IArticleBody,
  parseArticleBody
} from "@editor/app/editor/models/article.model";
import {
  map,
  switchMap,
  share,
  catchError,
  debounceTime
} from "rxjs/operators";
import { Router } from "@angular/router";

export const HomeCategories: ICategory = {
  id: "HomeCategoriesId",
  name: "Trang chủ",
  link: "/",
  position: 0
};

const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";
const CollectionPagingLimit = 7;

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  private className = "[Articles] ";

  lastStartAtCursor$: BehaviorSubject<number>;
  selectedCat$: BehaviorSubject<ICategory>;
  loading$: BehaviorSubject<boolean>;
  error$: BehaviorSubject<any>;
  categoriesList$: BehaviorSubject<ICategory[]>;

  cursor: number;

  constructor(private afFirestore: AngularFirestore, private router: Router) {
    this.lastStartAtCursor$ = new BehaviorSubject(null);
    this.selectedCat$ = new BehaviorSubject(HomeCategories);
    this.categoriesList$ = new BehaviorSubject(null);
    this.loading$ = new BehaviorSubject(false);
    this.error$ = new BehaviorSubject(null);

    this.getCategories().subscribe(categories =>
      this.categoriesList$.next(categories)
    );
  }

  getCategories = (): Observable<ICategory[]> => {
    this.loading$.next(true);
    return this.afFirestore
      .collection(CategoriesCollection, ref => ref.orderBy("position"))
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          console.log(this.className + "get categories finish");
          this.loading$.next(false);
          return new Array().concat(
            HomeCategories,
            snapshot.map(snap =>
              parseCategory(snap.payload.doc.id, snap.payload.doc.data())
            )
          );
        })
      );
  };

  getCategoryArticles = (
    id: string,
    lastStartAt: number
  ): Observable<IArticle[]> => {
    this.loading$.next(true);

    // Get the articles from firestore
    console.log(this.className + "getting articles for category", id);
    return this.afFirestore
      .collection(ArticlesCollection, ref => {
        let q =
          id !== HomeCategories.id ? ref.where("categoryId", "==", id) : ref;

        return q
          .where("status", "==", "published")
          .orderBy("publishAt", "desc")
          .startAfter(lastStartAt)
          .limit(CollectionPagingLimit);
      })
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          this.loading$.next(false);
          console.log(
            this.className + "found category result " + snapshot.length
          );
          if (snapshot.length === 0) {
            return null;
          }
          let result = snapshot.map(snap =>
            parseArticle(snap.payload.doc.id, snap.payload.doc.data())
          );
          this.cursor = result[result.length - 1].publishAt;
          return result;
        }),
        catchError(err => {
          console.log(
            this.className + "getting articles for category error",
            err
          );
          return of(err);
        }),
        share()
      );
  };

  loadMore = () => this.lastStartAtCursor$.next(this.cursor);

  getArticleData(id: string): Observable<IArticle> {
    this.loading$.next(true);
    console.log(this.className + "get article data " + id);

    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          this.loading$.next(false);
          return parseArticle(snapshot.payload.id, snapshot.payload.data());
        }),
        catchError(err => {
          console.log(this.className + "getting article data error", err);
          return of(err);
        })
      );
  }

  getBodyData(id: string): Observable<IArticleBody> {
    this.loading$.next(true);
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
          this.loading$.next(false);
          return snap.length > 0 ? parseArticleBody(snap[0]) : null;
        }),
        catchError(err => {
          console.log(this.className + "getting article body error", err);
          return of(err);
        })
      );
  }
}
