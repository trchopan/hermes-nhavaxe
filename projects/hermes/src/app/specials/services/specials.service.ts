import { Injectable } from "@angular/core";
import { UserService } from "@app/app/auth/services/user.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { LayoutService } from "@app/app/core/services/layout.service";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  parseSpecials,
  ISpecials
} from "@app/app/specials/models/specials.model";

const CacheCollection = "cache";
const SpecialsDoc = "specials";

@Injectable()
export class SpecialsService {
  private className = "SpecialsService";

  error$: BehaviorSubject<any>;
  specialList$: Observable<any[]>;

  constructor(
    private afFirestore: AngularFirestore,
    private layout: LayoutService
  ) {
    this.error$ = new BehaviorSubject(null);

    this.specialList$ = this.afFirestore
      .collection(CacheCollection)
      .doc(SpecialsDoc)
      .snapshotChanges()
      .pipe(
        map(
          snapshot =>
            snapshot.payload.exists
              ? parseSpecials(snapshot.payload.data())
              : null
        ),
        catchError(error => {
          this.error$.next(error);
          return of(null);
        })
      );
  }

  async update(specials: ISpecials) {
    this.layout.loading$.next(true);
    console.log(this.className + "updating cache", specials);
    try {
      await this.afFirestore
        .collection(CacheCollection)
        .doc(SpecialsDoc)
        .set(specials);
      this.layout.handleSuccess(this.className, null);
    } catch (error) {
      this.layout.handleError(this.className, "update", error);
    }
  }
}
