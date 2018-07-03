import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.scss"]
})
export class DateTimePickerComponent implements AfterViewInit {
  @Input("dateNumber")
  set dateSetter(dateNumber: number) {
    this.form = this.fb.group(
      this.parseTime(new Date(dateNumber || Date.now()))
    );
  }
  @Input() showTime: boolean = false;
  @Output() onChange = new EventEmitter();

  form: FormGroup;
  dates = Array.apply(null, { length: 31 }).map(Number.call, Number);
  months = Array.apply(null, { length: 12 }).map(Number.call, Number);
  years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  hours = Array.apply(null, { length: 24 }).map(Number.call, Number);
  minutes = Array.apply(null, { length: 60 }).map(Number.call, Number);

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit() {
    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      let date = this.form.controls.date.value;
      let month = this.form.controls.month.value;
      let year = this.form.controls.year.value;
      let hour = this.form.controls.hour.value;
      let minute = this.form.controls.minute.value;
      let timeString = `${year}-${month}-${date}`;
      timeString += this.showTime ? ` ${hour}:${minute}` : "";
      this.onChange.emit(new Date(timeString));
    });
  }

  parseTime = (date: Date) => ({
    date: [date.getDate()],
    month: [date.getMonth() + 1],
    year: [date.getFullYear()],
    hour: [date.getHours()],
    minute: [date.getMinutes()]
  });
}
