import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "publishAtParser"
})
export class PublishAtParserPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let lenght = Date.now() - value;
    let minutes = lenght / 60 / 1000;
    let hours = minutes / 60;
    let days = hours / 24;
    if (days > 7) {
      return new Date(value).toLocaleDateString();
    }
    if (days > 1) {
      return Math.floor(days) + " ngày trước";
    }
    if (hours > 1) {
      return Math.floor(hours) + " giờ trước";
    }
    return Math.floor(minutes) + " phút trước";
  }
}
