import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from 'src/app/projects/models/cable.model'
import { SurroundingModel } from 'src/app/projects/models/surrounding.model'
import { CablesEntityService } from '../../../services/cables-entity/cables-entity.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({
  name: 'getSurroundingsAsync',
  standalone: true,
})
export class GetSurroundingsAsyncPipe implements PipeTransform {
  constructor(private cablesEntity: CablesEntityService) {}

  transform(cable: CableModel): Observable<SurroundingModel> {
    if (!cable) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as unknown as Observable<SurroundingModel>
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
    )
  }
}
