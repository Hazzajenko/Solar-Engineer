import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'getGridString',
  standalone: true,
})
export class GetGridStringPipe implements PipeTransform {
  transform(row: number, col: number): string {
    // if (!row || !col) {
    //   return 0
    // }
    return `row${row}col${col}`
    /*
        type letter = 'a' | 'b' | 'c'

        let rowLetter: letter = 'a'
        let colLetter: letter = 'a'

        switch (true) {
          case row < 10:
            rowLetter = 'a'
            break
          case row < 20:
            rowLetter = 'b'
            break
          case row < 30:
            rowLetter = 'c'
            break
        }
        switch (true) {
          case col < 10:
            colLetter = 'a'
            break
          case col < 20:
            colLetter = 'b'
            break
          case col < 30:
            colLetter = 'c'
            break
        }
        // console.log(`${rowLetter}${row}${colLetter}${col}`)

        return `${rowLetter}${row}${colLetter}${col}`*/
  }
}
