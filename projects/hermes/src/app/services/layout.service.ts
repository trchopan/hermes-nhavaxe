import { Injectable, ElementRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  reachBottom$: BehaviorSubject<boolean>;
  showArticle: boolean = false;
  containerEl: ElementRef;
  clientWith: number

  constructor() {
    this.reachBottom$ = new BehaviorSubject(false);
  }

  scrollTop = () => {
    console.log("scrolling top");
    this.containerEl.nativeElement.scrollIntoView();
  };

  getViewWidth = () => this.containerEl.nativeElement.clientWidth;
}
