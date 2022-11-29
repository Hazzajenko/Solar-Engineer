import { Pipe, PipeTransform } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'

@Pipe({
  name: 'isPanelStringSelectedAsync',
  standalone: true,
})
export class IsPanelStringSelectedAsyncPipe implements PipeTransform {
  constructor(private store: Store<AppState>) {}

  transform(stringId: string): void {
    /*    if (!stringId) {
        }
        let numberRow: number = 0
        let numberCol: number = 0

        const location = cable.location
        const split = location.split('')
        split.forEach((p, index) => {
          if (p === 'c') {
            const row = location.slice(3, index)
            const col = location.slice(index + 3, location.length)
            numberRow = Number(row)
            numberCol = Number(col)
          }
        })
        const topString: string = `row${numberRow - 1}col${numberCol}`
        const bottomString: string = `row${numberRow + 1}col${numberCol}`
        const leftString: string = `row${numberRow}col${numberCol - 1}`
        const rightString: string = `row${numberRow}col${numberCol + 1}`

        return this.store.select(selectS)

        return this.cablesEntity.entities$.pipe(
          map((cables) => {
            const findTop = cables.find((cable) => cable.location === topString)
            const findBottom = cables.find(
              (cable) => cable.location === bottomString,
            )
            const findLeft = cables.find((cable) => cable.location === leftString)
            const findRight = cables.find((cable) => cable.location === rightString)

            return {
              left: !!findLeft,
              right: !!findRight,
              top: !!findTop,
              bottom: !!findBottom,
            } as SurroundingModel
          }),
        )*/
  }
}
