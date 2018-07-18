import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText'
})
export class TrimTextPipe implements PipeTransform {

  transform(text: string, amount: number): string {
    let finalText = text.substr(0, amount)
    if (text.length >= amount && amount > 0) {
      finalText += "..."
    }
    return finalText;
  }

}
