import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "leagueText"
})
export class LeagueTextPipe implements PipeTransform {
  transform(value: number): string {
    return (!value || value < 100) ? "đồng" : value < 200 ? "bạc" : "vàng";
  }
}
