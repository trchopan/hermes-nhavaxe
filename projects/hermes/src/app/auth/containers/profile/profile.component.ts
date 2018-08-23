import { Component } from "@angular/core";
import { UserService } from "@app/app/auth/services/user.service";
import { IProfile } from "@app/app/auth/models/profile.model";

enum dayDivider {
  night = 5,
  morning = 12,
  afternoon = 16,
  evening = 19
}

@Component({
  selector: "hm-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent {
  partOfDay: string;
  editProfile: IProfile;
  editManager: IProfile;
  updateManager: boolean = false;

  constructor(public user: UserService) {
    let hours = new Date().getHours();
    this.partOfDay =
      hours >= dayDivider.night && hours < dayDivider.morning
        ? "buổi sáng"
        : hours >= dayDivider.morning && hours < dayDivider.afternoon
          ? "buổi trưa"
          : hours >= dayDivider.afternoon && hours < dayDivider.evening
            ? "buổi chiều"
            : "buổi tối";
  }

  signOut() {
    this.user.signOut();
  }
}
