import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { AngularFirestore } from "angularfire2/firestore";
import { auth } from "firebase/app";
import { IAuth } from "@editor/app/auth/models/auth.model";
import { IProfile, parseProfile } from "@editor/app/auth/models/profile.model";

const UsersCollection = "users";
const ManagersCollection = "managers";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private className = "[User]";
  redirectUrl: string;
  authData: IAuth;
  profile: IProfile;
  isLoggedIn: boolean = false;
  isManager: boolean = false;
  managerProf: IProfile;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  error$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private aFs: AngularFirestore
  ) {
    // Stud data
    // this.authData = {
    //   id: "nCxyrSBwnLWDV96GcHWhbJc0Lqe2",
    //   email: "logan1011001@gmail.com"
    // };
    // this.profile = {
    //   avatar:
    //     "https://pbs.twimg.com/profile_images/644262622234284032/tpm8sb5J_400x400.jpg",
    //   fullname: "Cờ Toooo",
    //   phone: "",
    //   points: 0,
    //   greeting: ""
    // };
    // this.managerProf = {
    //   avatar:
    //     "https://pbs.twimg.com/profile_images/644262622234284032/tpm8sb5J_400x400.jpg",
    //   fullname: "Cờ To Thiệt To",
    //   phone: "",
    //   points: 0,
    //   greeting: ""
    // };
    // this.isLoggedIn = true;
    // this.isManager = true;
    // this.loading$.next(false)

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        console.log(this.className + " authed ", auth.uid);
        this.isLoggedIn = true;
        this.authData = { id: auth.uid, email: auth.email };
        this.loading$.next(true);
        this.aFs
          .collection("managers")
          .doc(auth.uid)
          .snapshotChanges()
          .subscribe(snapshot => {
            if (snapshot.payload.exists) {
              console.log(
                this.className + " manager ",
                snapshot.payload.data()
              );
              this.isManager = true;
              this.managerProf = parseProfile(snapshot.payload.data());
            } else {
              this.isManager = false;
              this.managerProf = null;
            }
          });

        this.aFs
          .collection("users")
          .doc(auth.uid)
          .snapshotChanges()
          .subscribe(snapshot => {
            console.log(this.className + " profile ", snapshot.payload.data());
            this.profile = snapshot.payload.exists
              ? parseProfile(snapshot.payload.data())
              : null;
            this.loading$.next(false);
          });
      } else {
        this.isLoggedIn = false;
        this.authData = null;
        this.loading$.next(false);
      }
    });
  }

  emailpasswordLogin(email: string, password: string) {
    this.loading$.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => this.handleSuccess(this.redirectUrl || "/"))
      .catch(error => {
        console.log("email password login error", error);
        this.handleError(error);
      });
  }

  googleLogin() {
    this.loading$.next(true);
    let provider = new auth.GoogleAuthProvider();
    auth().languageCode = "vi";
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(() => this.handleSuccess(this.redirectUrl || "/"))
      .catch(error => {
        console.log("google login error", error);
        this.handleError(error);
      });
  }

  signOut() {
    this.loading$.next(true);
    this.afAuth.auth
      .signOut()
      .then(() => this.handleSuccess())
      .catch(error => {
        console.error("sign out error", error);
        this.handleError(error);
      });
  }

  updateProfile = (profile: IProfile) => this.update(profile, UsersCollection);
  updateManager = (profile: IProfile) =>
    this.update(profile, ManagersCollection);

  update(profile: IProfile, collection: string) {
    console.log(this.className + " updating profile...");
    this.loading$.next(true);
    this.aFs
      .collection(collection)
      .doc(this.authData.id)
      .update(profile)
      .then(() => this.loading$.next(false))
      .catch(error => {
        console.error(`update ${collection} error`, error);
        this.handleError(error);
      });
  }

  handleError = error => {
    this.error$.next(error);
    this.loading$.next(false);
  };

  handleSuccess = (navigate?: string) => {
    this.error$.next(null);
    this.loading$.next(false);
    this.router.navigate([navigate || "/"]);
  };
}
