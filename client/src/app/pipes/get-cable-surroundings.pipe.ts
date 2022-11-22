import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/cable.model'
import { CablesEntityService } from '../projects/project-id/services/cables-entity/cables-entity.service'

export interface SurroundingModel {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

@Pipe({
  name: 'getCableSurroundings',
  standalone: true,
})
export class GetCableSurroundingsPipe implements PipeTransform {
  constructor(private cablesEntity: CablesEntityService) {
  }

  transform(cable: CableModel): SurroundingModel {
    if (!cable) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as SurroundingModel
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

    let allCables: CableModel[] = []
    this.cablesEntity.entities$.subscribe(cables => {
      allCables = cables
    })

    const findTop = allCables.find((cable) => cable.location === topString)
    const findBottom = allCables.find(
      (cable) => cable.location === bottomString,
    )
    const findLeft = allCables.find((cable) => cable.location === leftString)
    const findRight = allCables.find((cable) => cable.location === rightString)

    if (findTop) console.log('FIND TOP', findTop.location)
    if (findBottom) console.log('FIND BOTTOM', findBottom.location)
    if (findLeft) console.log('FIND LEFT', findLeft.location)
    if (findRight) console.log('FIND RIGHT', findRight.location)

    return {
      left: !!findLeft,
      right: !!findRight,
      top: !!findTop,
      bottom: !!findBottom,
    } as SurroundingModel
  }
}
