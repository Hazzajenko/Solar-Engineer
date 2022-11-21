import { Pipe, PipeTransform } from '@angular/core'
import { CableModel } from '../projects/models/cable.model'
import { Store } from '@ngrx/store'
import { AppState } from '../store/app.state'
import { JoinsEntityService } from '../projects/project-id/services/joins-entity/joins-entity.service'
import { combineLatest } from 'rxjs'
import { CablesEntityService } from '../projects/project-id/services/cables-entity/cables-entity.service'
import { Guid } from 'guid-typescript'

export interface SurroundingModel {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

@Pipe({
  name: 'joinNearbyBlocks',
  standalone: true,
})
export class JoinNearbyBlocksPipe implements PipeTransform {
  constructor(
    private store: Store<AppState>,
    private joinsEntity: JoinsEntityService,
    private cablesEntity: CablesEntityService,
  ) {
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

      const newJoinId = Guid.create().toString()

      if (findTop) {
        const cable = cables.find(
          (cable) => cable.location === findTop.location,
        )
        if (cable) {
          if (cable.in_join) {
            console.log('JOIN TOP', findTop.location)
            const cablesInJoin = cables.filter(getCable => getCable.join_id === cable.join_id)
            cablesInJoin.forEach(cableInJoin => {
              const update: CableModel = {
                ...cableInJoin,
                join_id: newJoinId
              }

              this.cablesEntity.update(update)
            })
            top = true
          }
        }
        /*        const block = join.blocks.find((block) => block === findTop.location)
                if (block) {
                  console.log('FIND TOP', findTop.location)
                  top = true
                  block.
                }*/
      }
      if (findBottom) {
        const cable = cables.find(
          (cable) => cable.location === findBottom.location,
        )
        if (cable) {
          if (cable.in_join) {
            console.log('JOIN BOTTOM', findBottom.location)
            bottom = true
          }
        }
      }
      if (findLeft) {
        const cable = cables.find(
          (cable) => cable.location === findLeft.location,
        )
        if (cable) {
          if (cable.in_join) {
            console.log('JOIN LEFT', findLeft.location)
            left = true
          }
        }
      }
      if (findRight) {
        const cable = cables.find(
          (cable) => cable.location === findRight.location,
        )
        if (cable) {
          if (cable.in_join) {
            console.log('JOIN RIGHT', findRight.location)
            right = true
          }
        }
        /*        if (join.blocks.find((block) => block === findRight.location)) {
                  console.log('FIND RIGHT', findRight.location)
                  right = true
                }*/
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
