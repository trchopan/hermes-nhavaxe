import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "leagueImage"
})
export class LeagueImagePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    var imgRoot = "assets/images/";
    return (
      imgRoot +
      (!value || value < 100
        ? "bronze.png"
        : value < 200
          ? "silver.png"
          : "gold.png")
    );
  }
}
