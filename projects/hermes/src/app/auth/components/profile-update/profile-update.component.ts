import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { IProfile } from "@app/app/auth/models/profile.model";

@Component({
  selector: "profile-update",
  templateUrl: "./profile-update.component.html",
  styleUrls: ["./profile-update.component.scss"]
})
export class ProfileUpdateComponent {
  @Input("profile")
  set profileSetter(profile: IProfile) {
    this.form.controls.fullname.setValue(profile.fullname);
    this.form.controls.avatar.setValue(profile.avatar);
    this.form.controls.phone.setValue(profile.phone);
  }
  @Output() onSubmit = new EventEmitter();
  @Output() onCancle = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullname: [null, Validators.required],
      avatar: [null, Validators.required],
      phone: [
        null,
        [
          Validators.pattern("0[0-9]*"),
          Validators.minLength(10),
          Validators.maxLength(11)
        ]
      ]
    });

    this.form.controls.phone.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((phone: string) => {
        this.form.controls.phone.setValue(phone.replace(/[^0-9]/g, ""));
      });
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}
