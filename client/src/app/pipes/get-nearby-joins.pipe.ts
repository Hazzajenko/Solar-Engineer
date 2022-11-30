import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/cable.model'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { JoinsEntityService } from '../projects/project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { combineLatest } from 'rxjs'
import { CablesEntityService } from '../projects/project-id/services/ngrx-data/cables-entity/cables-entity.service'

export interface SurroundingModel {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

@Pipe({
  name: 'getNearbyJoins',
  standalone: true,
})
export class GetNearbyJoins implements PipeTransform {
  constructor(
    private store: Store<AppState>,
    private joinsEntity: JoinsEntityService,
    private cablesEntity: CablesEntityService,
  ) {}

  transform(cable: CableModel): SurroundingModel {
    if (!cable) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as SurroundingModel
    }

    if (!cable.join_id) {
      return {
        left: false,
        right: false,
        top: false,
        bottom: false,
      } as SurroundingModel
    }

    let top: boolean = false
    let bottom: boolean = false
    let left: boolean = false
    let right: boolean = false

    const data = combineLatest([
      this.joinsEntity.entities$,
      this.cablesEntity.entities$,
    ]).subscribe(([joins, cables]) => {
      const join = joins.find((join) => join.id === cable.join_id)
      if (!join) return console.log('no join exists')

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

      const findTop = cables.find((cable) => cable.location === topString)
      const findBottom = cables.find((cable) => cable.location === bottomString)
      const findLeft = cables.find((cable) => cable.location === leftString)
      const findRight = cables.find((cable) => cable.location === rightString)

      if (findTop) {
        if (join.blocks?.find((block) => block === findTop.location)) {
          console.log('FIND TOP', findTop.location)
          top = true
        }
      }
      if (findBottom) {
        if (join.blocks?.find((block) => block === findBottom.location)) {
          console.log('FIND BOTTOM', findBottom.location)
          bottom = true
        }
      }
      if (findLeft) {
        if (join.blocks?.find((block) => block === findLeft.location)) {
          console.log('FIND LEFT', findLeft.location)
          left = true
        }
      }
      if (findRight) {
        if (join.blocks?.find((block) => block === findRight.location)) {
          console.log('FIND RIGHT', findRight.location)
          right = true
        }
      }
    })

    data.unsubscribe()

    return {
      left,
      right,
      top,
      bottom,
    } as SurroundingModel
  }
}
