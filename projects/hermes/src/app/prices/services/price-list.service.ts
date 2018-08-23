import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { Observable, BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LayoutService } from "@app/app/core/services/layout.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { IFieldDoc, IFieldData } from "@admin/app/fields.models";

const HousePricesCollection = "houseprices";
const CarPricesCollection = "careprices";
const FieldsDocument = "_fields";

@Injectable({
  providedIn: "root"
})
export class PriceListService {
  private className = "PriceList";
  error$: BehaviorSubject<any>;

  priceCollection: string = HousePricesCollection;

  constructor(
    private afFirestore: AngularFirestore,
    private router: Router,
    private snackbar: MatSnackBar,
    private layout: LayoutService
  ) {
    this.error$ = new BehaviorSubject(null);
  }

  getFields(): Observable<IFieldData[]> {
    return this.afFirestore
      .collection(this.priceCollection)
      .doc<IFieldDoc>(FieldsDocument)
      .valueChanges()
      .pipe(
        tap(value => console.log("value is", value)),
        map(value => value.fieldData)
      );
  }

  setPriceCollection(type: string) {
    if (type === HousePricesCollection) {
      this.priceCollection = HousePricesCollection;
    } else {
      this.priceCollection = CarPricesCollection;
    }
  }

  create(priceData) {
    console.log(this.className + " creating price in", this.priceCollection);
    this.layout.loading$.next(true);
    this.afFirestore
      .collection(this.priceCollection)
      .add(priceData)
      .then(() => this.handleSuccess())
      .catch(err => this.handleError("creating", err));
  }

  remove(priceId, priceData) {
    console.log(this.className + " creating price in", this.priceCollection);
    this.layout.loading$.next(true);
    this.afFirestore
      .collection(this.priceCollection)
      .doc(priceId)
      .update(priceData)
      .then(() => this.handleSuccess())
      .catch(err => this.handleError("update", err));
  }

  handleSuccess() {
    console.log(this.className + " success");
    this.router.navigate(["article"]);
    this.snackbar.open("Bảng giá đã được cập nhật", null, {
      duration: 1000
    });
    this.layout.loading$.next(false);
  }

  handleError(operation: string, err: any) {
    console.error(this.className + operation + " error ", err);
    this.error$.next(err);
    this.snackbar.open("Lỗi cập nhật bảng giá", null, {
      duration: 1000
    });
    this.layout.loading$.next(false);
  }
}
