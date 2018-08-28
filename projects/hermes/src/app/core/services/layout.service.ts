import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class LayoutService {
  loading$: BehaviorSubject<boolean>;
  error$: BehaviorSubject<any>;
  showArticle: boolean;

  constructor(private router: Router, private snackbar: MatSnackBar) {
    this.loading$ = new BehaviorSubject(false);
    this.error$ = new BehaviorSubject(null);
  }

  handleSuccess(className: string, navigateTo: string) {
    console.log(className + " success");
    this.router.navigate([navigateTo]);
    this.snackbar.open("Cập nhật thành công", null, {
      duration: 1000
    });
    this.loading$.next(false);
  }

  handleError(className: string, operation: string, err: any) {
    console.error(className + operation + " error ", err);
    this.error$.next(err);
    this.snackbar.open("Lỗi cập nhật", null, {
      duration: 1000
    });
    this.loading$.next(false);
  }

  formError() {
    this.snackbar.open("Form chưa hoàn thành", null, {
      duration: 1000
    });
  }

  clearError() {
    this.error$.next(null);
  }
}
