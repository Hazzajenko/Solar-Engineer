import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'getGridNumber',
  standalone: true,
})
export class GetGridNumberPipe implements PipeTransform {
  transform(row: number, col: number): number {
    // if (!row || !col) {
    //   return 0
    // }

    return Number(`${row}${col}`)
  }
}
