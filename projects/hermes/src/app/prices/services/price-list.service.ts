import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, BehaviorSubject } from "rxjs";
import { map, switchMap, share } from "rxjs/operators";
import { LayoutService } from "@app/app/core/services/layout.service";
import {
  IHousePrice,
  parseHousePrice
} from "@app/app/prices/models/houseprice.model";
import {
  ICarPrice,
  parseCarPrice
} from "@app/app/prices/models/carprice.model";

export const HousePricesCollection = "houseprices";
export const CarPricesCollection = "carprices";

@Injectable({
  providedIn: "root"
})
export class PriceListService {
  private className = "PriceList";

  error$: BehaviorSubject<any>;
  priceCollection$: BehaviorSubject<string>;
  priceData$: Observable<any[]>;
  selectedField$: BehaviorSubject<IHousePrice | ICarPrice>;

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.error$ = new BehaviorSubject(null);
    this.priceCollection$ = new BehaviorSubject(HousePricesCollection);
    this.selectedField$ = new BehaviorSubject(null);

    this.priceData$ = this.priceCollection$.pipe(
      switchMap(collectionName =>
        this.afFirestore
          .collection(collectionName, ref => ref.orderBy("publishAt", "desc"))
          .snapshotChanges()
          .pipe(
            map(snapshot =>
              snapshot.map(snap => {
                const doc = snap.payload.doc;
                return collectionName === HousePricesCollection
                  ? parseHousePrice(doc.id, doc.data())
                  : parseCarPrice(doc.id, doc.data());
              })
            )
          )
      ),
      share()
    );
  }

  setPriceCollection(type: string) {
    this.selectedField$.next(null);
    if (type === HousePricesCollection) {
      this.priceCollection$.next(HousePricesCollection);
    } else {
      this.priceCollection$.next(CarPricesCollection);
    }
  }

  create(priceData) {
    console.log(
      this.className + " creating price in",
      this.priceCollection$.value
    );
    this.layout.loading$.next(true);
    return this.afFirestore
      .collection(this.priceCollection$.value)
      .add(priceData);
  }

  update(priceData) {
    console.log(
      this.className + " creating price in",
      this.priceCollection$.value
    );
    this.layout.loading$.next(true);
    return this.afFirestore
      .collection(this.priceCollection$.value)
      .doc(priceData.id)
      .update(priceData);
  }

  remove(priceId) {
    console.log(
      this.className + " removing price in",
      this.priceCollection$.value
    );
    this.layout.loading$.next(true);
    return this.afFirestore
      .collection(this.priceCollection$.value)
      .doc(priceId)
      .delete()
  }
}
