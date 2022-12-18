import { Pipe, PipeTransform } from '@angular/core'
import { SurroundingModel } from '@shared/data-access/models'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { TraysEntityService } from '@grid-layout/data-access/store'
import { TrayModel } from '@shared/data-access/models'

@Pipe({
  name: 'getTrayJoins',
  standalone: true,
})
export class GetTrayJoinsPipe implements PipeTransform {
  constructor(private traysEntity: TraysEntityService) {}

  transform(tray: TrayModel): Observable<SurroundingModel> {
    if (!tray) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as unknown as Observable<SurroundingModel>
    }
    let numberRow: number = 0
    let numberCol: number = 0

    const location = tray.location
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

    return this.traysEntity.entities$.pipe(
      map((cables) => {
        const findTop = cables.find((cable) => cable.location === topString)
        const findBottom = cables.find((cable) => cable.location === bottomString)
        const findLeft = cables.find((cable) => cable.location === leftString)
        const findRight = cables.find((cable) => cable.location === rightString)

        return {
          left: !!findLeft,
          right: !!findRight,
          top: !!findTop,
          bottom: !!findBottom,
        } as SurroundingModel
      }),
    )
  }
}
