import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { UserService } from "@app/app/auth/services/user.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(
    private auth: AngularFireAuth,
    private user: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // return of(true)
    return this.auth.authState.pipe(
      switchMap(authState => {
        if (authState) {
          return of(true);
        } else {
          this.user.redirectUrl = state.url;
          this.router.navigate(["/login"]);
          console.log("Not Authed redirectUrl is", state.url);
          return of(false);
        }
      })
    );
  }
}
