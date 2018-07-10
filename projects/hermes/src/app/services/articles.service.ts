import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { BehaviorSubject, Observable, of, combineLatest } from "rxjs";
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
import { map, switchMap, share, catchError } from "rxjs/operators";
import { Router } from "@angular/router";

export const QueryAllCategories = "QueryAllCategories";
const ArticlesCollection = "articles";
const BodyCollection = "body";
const CategoriesCollection = "categories";
const CollectionPagingLimit = 7;

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  private className = "[Articles] ";

  loading$: BehaviorSubject<boolean>;
  error$: BehaviorSubject<any>;
  list$: Observable<IArticle[]>;
  categoryId$: BehaviorSubject<string>;
  categoryPublishAtCursor$: BehaviorSubject<number>;
  cache$: BehaviorSubject<{ [key: string]: IArticle[] }>;
  selectedMeta$: BehaviorSubject<IArticle>;
  selectedBody$: Observable<IArticleBody>;

  more: boolean;

  constructor(private afFirestore: AngularFirestore, private router: Router) {
    this.loading$ = new BehaviorSubject(false);
    this.error$ = new BehaviorSubject(null);
    this.categoryId$ = new BehaviorSubject(null);
    this.categoryPublishAtCursor$ = new BehaviorSubject(Date.now());
    this.cache$ = new BehaviorSubject({});
    this.selectedMeta$ = new BehaviorSubject(null);

    // Get the articles in category
    const result$ = this.categoryId$.pipe(
      switchMap(catId => {
        this.loading$.next(true);
        let cacheList = this.cache$.value ? this.cache$.value[catId] : null;
        // Return the cache when no request for more
        if (!this.more && cacheList) {
          console.log(this.className + "loading from cache");
          this.loading$.next(false);
          return of(null);
        }

        // Get the articles from firestore
        let lastStartAt = cacheList
          ? cacheList[cacheList.length - 1].publishAt
          : Date.now();
        this.categoryPublishAtCursor$.next(lastStartAt);
        return this.afFirestore
          .collection(ArticlesCollection, ref => {
            let q =
              catId === QueryAllCategories
                ? ref
                : ref.where("categoryId", "==", catId);

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
              let result = snapshot.map(snap =>
                parseArticle(snap.payload.doc.id, snap.payload.doc.data())
              );
              console.log(this.className + "found category result", catId);
              return result;
            })
          );
      }),
      share(),
      catchError(err => of(err))
    );

    // Cache the result from article query results
    result$.subscribe(list => {
      let id = this.categoryId$.value;
      let cacheValue = this.cache$.value;
      if (!list || list.length === 0) {
        return;
      }

      let categoryArray =
        cacheValue && cacheValue[id] ? [...cacheValue[id], ...list] : list;
      let newCategory = { [id]: categoryArray };
      let newCache = { ...cacheValue, ...newCategory };
      console.log(this.className + "new newCache", newCache);
      this.cache$.next(newCache);
    });

    // Combine the request category and cache for the final list
    this.list$ = combineLatest(this.categoryId$, this.cache$).pipe(
      map(([id, cache]) => {
        if (!cache || !cache[id]) {
          return null;
        }
        return cache[id];
      })
    );

    // Get the body of selected article
    this.selectedBody$ = this.selectedMeta$.pipe(
      switchMap(article => (article ? this.getBodyData(article.id) : of(null)))
    );
  }

  getCategories(): Observable<ICategory[]> {
    this.loading$.next(true);
    return this.afFirestore
      .collection(CategoriesCollection, ref => ref.orderBy("position"))
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          console.log(this.className + "get categories finish");
          this.loading$.next(false);
          return snapshot.map(snap =>
            parseCategory(snap.payload.doc.id, snap.payload.doc.data())
          );
        })
      );
  }

  loadByCategoryId(catId: string, more?: boolean) {
    console.log(this.className + "setting catId", catId, more);
    this.loading$.next(true);
    this.more = more || false;
    this.categoryId$.next(catId);
  }

  loadMore = () => this.loadByCategoryId(this.categoryId$.value, true);

  clearCacheReload() {
    this.cache$.next(null);
    this.categoryPublishAtCursor$.next(Date.now());
    this.categoryId$.next(QueryAllCategories);
    this.router.navigate(["/home"]);
  }

  selectArticle = (article: IArticle) => this.selectedMeta$.next(article);
  clearSelected = () => this.selectedMeta$.next(null);

  getArticleData(id: string): Observable<IArticle> {
    this.loading$.next(true);
    return this.afFirestore
      .collection(ArticlesCollection)
      .doc(id)
      .valueChanges()
      .pipe(
        map(value => {
          console.log(this.className + "get article data " + id);
          this.loading$.next(false);
          return parseArticle(id, value);
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
          console.log(this.className + "get article body" + id);
          this.loading$.next(false);
          return snap.length > 0 ? parseArticleBody(snap[0]) : null;
        })
      );
  }
}
