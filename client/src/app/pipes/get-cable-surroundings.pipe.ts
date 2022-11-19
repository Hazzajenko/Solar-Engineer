import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/cable.model'
import { JoinModel } from '../projects/models/join.model'

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
  transform(
    cable: CableModel,
    allCables: CableModel[],
    joins: JoinModel[],
  ): SurroundingModel {
    if (!cable || !allCables || !joins) {
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
      if (p === 'b') {
        const row = location.slice(1, index)
        const col = location.slice(index + 1, location.length)
        // console.log(row)
        // console.log(col)
        numberRow = Number(row)
        numberCol = Number(col)
      }
    })

    const topString: string = `a${numberRow - 1}b${numberCol}`
    const bottomString: string = `a${numberRow + 1}b${numberCol}`
    const leftString: string = `a${numberRow}b${numberCol - 1}`
    const rightString: string = `a${numberRow}b${numberCol + 1}`

    const findTop = allCables.find((cable) => cable.location === topString)
    const findBottom = allCables.find(
      (cable) => cable.location === bottomString,
    )
    const findLeft = allCables.find((cable) => cable.location === leftString)
    const findRight = allCables.find((cable) => cable.location === rightString)

    /*    console.log(!!findTop)
        console.log(!!findBottom)
        console.log(!!findLeft)
        console.log(!!findRight)*/

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
    // const top = allCables.find()
  }
}
