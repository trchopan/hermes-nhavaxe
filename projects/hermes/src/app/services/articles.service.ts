import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { BehaviorSubject } from "rxjs";
import { StubCacheList, StubCategories } from "@app/app/services/stub-data";
import { ICategory } from "@editor/app/editor/models/category.model";

const ArticlesCollection = "articles";
const CacheCollection = "cache";

@Injectable({
  providedIn: "root"
})
export class ArticlesService {
  cacheList$: BehaviorSubject<ICacheArticle[]>;
  categoriesList$: BehaviorSubject<ICategory[]>;
  loading$: BehaviorSubject<boolean>;
  error$: BehaviorSubject<any>;

  constructor(private aFs: AngularFirestore) {
    this.cacheList$ = new BehaviorSubject<ICacheArticle[]>(null);
    this.categoriesList$ = new BehaviorSubject<ICategory[]>(null);
    this.loading$ = new BehaviorSubject<boolean>(false);
    this.error$ = new BehaviorSubject<any>(null);

    this.cacheList$.next(StubCacheList);
    this.categoriesList$.next(StubCategories);
  }
}
