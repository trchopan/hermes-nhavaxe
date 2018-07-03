import { Component, OnDestroy } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { Subject, Observable } from "rxjs";
import { takeUntil, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "hm-editor-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  ngUnsub = new Subject();
  form: FormGroup;
  error$: Observable<string>;

  constructor(
    public user: UserService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
    this.afAuth.authState.pipe(takeUntil(this.ngUnsub)).subscribe(auth => {
      if (auth) {
        this.router.navigate([this.user.redirectUrl || "/"]);
        this.user.redirectUrl = null;
        this.ngUnsub.next();
        this.ngUnsub.complete();
      }
    });
    this.error$ = this.user.error$.pipe(
      map(error => {
        if (!error) {
          return null
        }
        switch(error.code) {
          case 'auth/invalid-email':
          case 'auth/wrong-password':
          return "Email hoặc password không đúng"
          default:
          return 'Lỗi kết nối server. Vui lòng báo cho admin.';
        }
      })
    )
  }

  get email() {
    return this.form.get("email");
  }
  get password() {
    return this.form.get("password");
  }

  onSubmit() {
    if (this.form.valid) {
      let email = this.form.controls.email.value;
      let password = this.form.controls.password.value;
      console.log("Logging in", email, password);
      this.user.emailpasswordLogin(email, password);
    }
  }
}
