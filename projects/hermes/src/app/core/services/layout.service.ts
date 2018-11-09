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
    navigateTo && this.router.navigate([navigateTo]);
    this.snackbar.open("Cập nhật thành công", null, {
      duration: 1000
    });
    this.loading$.next(false);
  }

  handleError(className: string, operation: string, err: any) {
    console.error(className + operation + " error ", err);
    if (err && err.code) {
      switch (err.code) {
        case "permission-denied":
          err.message = "Bạn không có quyền thực hiện thao tác.";
          break;
        default:
          err.message = "Lỗi không xác định. Vui lòng liên hệ admin.";
          break;
      }
    }
    this.error$.next(err);
    this.snackbar.open("Xảy ra lỗi", null, {
      duration: 1000
    });
    this.loading$.next(false);
  }

  snackDismiss() {
    this.snackbar.dismiss();
  }

  snackSuccess(message: string) {
    this.snackbar.open(message, "", {
      duration: 2000
    });
  }

  snackWarning(message: string) {
    this.snackbar.open(message, "Đóng", {
      duration: 10000
    });
  }

  clearError() {
    this.error$.next(null);
  }
}
