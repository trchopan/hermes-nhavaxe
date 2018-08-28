import { Pipe, PipeTransform } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";

@Pipe({
  name: "formatNewlineSplash"
})
export class FormatNewlineSplashPipe implements PipeTransform {
  transform(value: string): SafeHtml {
    let result = value.split("//");
    return result;
  }
}
