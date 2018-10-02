import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LayoutService } from "@app/app/core/services/layout.service";

const API_URL = "https://nhavaxe.vn/api/pullGoogleSheet";

@Injectable()
export class PricesService {
  private className = "PricesService";

  error$: BehaviorSubject<any>;
  result$: BehaviorSubject<string>;

  constructor(private layout: LayoutService) {
    this.error$ = new BehaviorSubject(null);
    this.result$ = new BehaviorSubject("");
  }

  async update() {
    this.layout.loading$.next(true);
    this.error$.next(null);
    try {
      const respond = await fetch(API_URL).then(res => res.json());
      if (respond.result !== "success") {
        this.error$.next("Lỗi xảy ra. Dữ liệu chưa được cập nhật.");
      } else {
        this.result$.next(
          "Cập nhập thành công. Vào lúc " + new Date().toLocaleString()
        );
      }
      this.layout.loading$.next(false);
    } catch (error) {
      this.error$.next(error);
    }
  }
}
