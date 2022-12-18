import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'getLocation',
  standalone: true,
})
export class GetLocationPipe implements PipeTransform {
  transform(row: number, col: number): string {
    return `row${row}col${col}`
  }
}
