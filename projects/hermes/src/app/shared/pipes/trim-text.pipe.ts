import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "trimText"
})
export class TrimTextPipe implements PipeTransform {
  transform(text: string, amount: number): string {
    return text.substr(0, amount);
  }
}
