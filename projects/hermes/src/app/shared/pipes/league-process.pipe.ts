import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leagueProcess'
})
export class LeagueProcessPipe implements PipeTransform {

  transform(value: number): number {
    return value - Math.floor(value/100)*100
  }

}
