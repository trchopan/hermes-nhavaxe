import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  loading$: BehaviorSubject<boolean>;

  constructor() {
    this.loading$ = new BehaviorSubject(false);
  }
}
