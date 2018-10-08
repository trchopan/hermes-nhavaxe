import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { LayoutService } from "@app/app/core/services/layout.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { IBanner, parseBanner } from "@app/app/banner/models/banner.model";
import { catchError, map } from "rxjs/operators";
import { UserService } from "@app/app/auth/services/user.service";

export const BannerCollection = "banners";

@Injectable()
export class BannerService {
  private className = "BannerSerice";

  error$: BehaviorSubject<any>;
  bannerList$: Observable<IBanner[]>;

  constructor(
    private user: UserService,
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.error$ = new BehaviorSubject(null);

    this.bannerList$ = this.afFirestore
      .collection(BannerCollection, ref => ref.orderBy("expire", "desc"))
      .snapshotChanges()
      .pipe(
        map(snapshot =>
          snapshot.map(snap =>
            parseBanner(snap.payload.doc.id, snap.payload.doc.data())
          )
        ),
        catchError(error => {
          this.error$.next(error);
          return of(null);
        })
      );
  }

  create(banner: IBanner) {
    console.log(this.className + " creating", banner);
    banner.creatorId = this.user.authData.id;
    this.layout.loading$.next(true);
    return this.afFirestore.collection(BannerCollection).add(banner);
  }

  update(banner: IBanner) {
    console.log(this.className + " updating", banner);
    this.layout.loading$.next(true);
    if (this.user.isManager) {
      banner.managerId = this.user.authData.id;
    }
    return this.afFirestore
      .collection(BannerCollection)
      .doc(banner.id)
      .update(banner);
  }

  remove(banner: IBanner) {
    console.log(this.className + " removing", banner);
    this.layout.loading$.next(true);
    if (!this.user.isManager) {
      return Promise.reject({ code: "permission-denied" });
    }
    return this.afFirestore
      .collection(BannerCollection)
      .doc(banner.id)
      .delete();
  }
}
