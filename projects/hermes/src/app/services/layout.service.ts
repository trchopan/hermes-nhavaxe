import { Injectable, ElementRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  reachBottom$: BehaviorSubject<boolean>;
  showArticle: boolean = false;
  headEl: ElementRef;
  clientWith: number;

  constructor() {
    this.reachBottom$ = new BehaviorSubject(false);
  }

  scrollTop = () => {
    console.log("scrolling top");
    this.headEl.nativeElement.scrollIntoView({ behavior: "smooth" });
  };

  getViewWidth = () => this.headEl.nativeElement.clientWidth;
}
