import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'
import { CableModel } from '../../models/cable.model'
import { InverterModel } from '../../models/inverter.model'
import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { combineLatest } from 'rxjs'
import { Guid } from 'guid-typescript'
import { SurroundingModel } from '../../../pipes/join-nearby-blocks.pipe'
import { JoinModel } from '../../models/join.model'
import { JoinsService } from '../joins.service'

@Injectable({
  providedIn: 'root',
})
export class GridUpdateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    private joinsService: JoinsService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity)
  }

  gridDrop(
    event: CdkDragDrop<any, any>,
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const doesExist = blocks.find(
      (block) => block.location.toString() === event.container.id,
    )

    if (doesExist) {
      return console.log('location taken')
    }

    const block = event.item.data
    const location = event.container.id

    switch (block.model) {
      case UnitModel.PANEL:
        const panel: PanelModel = {
          ...block,
          location,
        }
        return this.panelsEntity.update(panel)

      case UnitModel.CABLE:
        /*        const cable: CableModel = {
                  ...block,
                  location,
                }
                return this.cablesEntity.update(cable)*/
        this.joinNearbyCables(block, location)
        break

      case UnitModel.INVERTER:
        const inverter: InverterModel = {
          ...block,
          location,
        }
        return this.invertersEntity.update(inverter)

      default:
        break
    }
  }

  joinNearbyCables(cable: CableModel, location: string) {
    if (!cable) {
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

    const nullCable: CableModel = {
      id: '',
      location: '',
    }

    let joinTop: CableModel = nullCable
    let joinBottom: CableModel = nullCable
    let joinLeft: CableModel = nullCable
    let joinRight: CableModel = nullCable

    let joins: JoinModel[] = []
    let cables: CableModel[] = []

    combineLatest([
      this.joinsEntity.entities$,
      this.cablesEntity.entities$,
    ]).subscribe(([joins$, cables$]) => {
      joins = joins$
      cables = cables$
    })

    // const join = joins.find((join) => join.id === cable.join_id)
    // if (!join) {
    //   const create: CableModel = {
    //     ...cable,
    //     location,
    //   }
    //   return this.cablesEntity.update(create)
    // }

    let numberRow: number = 0
    let numberCol: number = 0

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
      console.log('FIND TOP', findTop.location)
      // const cableTop = cables.find(
      //   (cable) => cable.location === findTop.location,
      // )
      console.log(findTop)
      if (findTop) {
        top = true
        if (findTop.in_join) {
          console.log('JOIN TOP', findTop.location)

          joinTop = findTop
          const update: CableModel = {
            ...cable,
            location,
            join_id: joinTop.join_id,
          }
          this.cablesEntity.update(update)
        } else {
          console.log('else')
          const joinRequest: JoinModel = {
            id: newJoinId,
            project_id: findTop.project_id!,
            color: 'purple',
            model: UnitModel.JOIN,
            size: 4,
            type: 'JOIN',
          }
          this.joinsEntity.add(joinRequest)
          const update: CableModel = {
            ...cable,
            location,
            join_id: newJoinId,
            in_join: true,
          }
          this.cablesEntity.update(update)
          const otherBlock: CableModel = {
            ...findTop,
            join_id: newJoinId,
            in_join: true,
          }
          this.cablesEntity.update(otherBlock)
        }
      }
    }

    if (findBottom) {
      if (findBottom.in_join) {
        this.joinsService.update(findBottom.join_id!, newJoinId)
      } else {
        const update: CableModel = {
          ...findBottom,
          join_id: newJoinId,
        }
        this.cablesEntity.update(update)
      }

      console.log('FIND BOTTOM', findBottom.location)

      bottom = true
      if (findBottom.in_join) {
        console.log('JOIN BOTTOM', findBottom.location)

        joinBottom = findBottom
      }
    }
    if (findLeft) {
      console.log('FIND LEFT', findLeft.location)
      const cableLeft = cables.find(
        (cable) => cable.location === findLeft.location,
      )
      if (cableLeft) {
        left = true
        if (cableLeft.in_join) {
          console.log('JOIN LEFT', findLeft.location)

          joinLeft = cableLeft
        }
      }
    }
    if (findRight) {
      console.log('FIND RIGHT', findRight.location)
      const cableRight = cables.find(
        (cable) => cable.location === findRight.location,
      )
      if (cableRight) {
        right = true
        if (cableRight.in_join) {
          console.log('JOIN RIGHT', findRight.location)

          joinRight = cableRight
        }
      }
    }
    // if (top) {
    //   const update: CableModel = {
    //     ...cable,
    //     location,
    //     join_id: joinTop.join_id,
    //   }
    //   this.cablesEntity.update(update)
    //   // this.cablesEntity.
    // }
    return
    /*    if (findBottom) {
          const cable = cables.find(
            (cable) => cable.location === findBottom.location,
          )
          if (cable) {
            if (cable.in_join) {
              const cablesInJoin = cables.filter(
                (getCable) => getCable.join_id === cable.join_id,
              )
              cablesInJoin.forEach((cableInJoin) => {
                const update: CableModel = {
                  ...cableInJoin,
                  join_id: newJoinId,
                }

                this.cablesEntity.update(update)
              })
              console.log('JOIN BOTTOM', findBottom.location)
              // bottom = true
            }
          }
        }
        if (findLeft) {
          const cable = cables.find((cable) => cable.location === findLeft.location)
          if (cable) {
            if (cable.in_join) {
              const cablesInJoin = cables.filter(
                (getCable) => getCable.join_id === cable.join_id,
              )
              cablesInJoin.forEach((cableInJoin) => {
                const update: CableModel = {
                  ...cableInJoin,
                  join_id: newJoinId,
                }

                this.cablesEntity.update(update)
              })
              console.log('JOIN LEFT', findLeft.location)
              // left = true
            }
          }
        }
        if (findRight) {
          const cable = cables.find(
            (cable) => cable.location === findRight.location,
          )
          if (cable) {
            if (cable.in_join) {
              const cablesInJoin = cables.filter(
                (getCable) => getCable.join_id === cable.join_id,
              )
              cablesInJoin.forEach((cableInJoin) => {
                const update: CableModel = {
                  ...cableInJoin,
                  join_id: newJoinId,
                }

                this.cablesEntity.update(update)
              })
              console.log('JOIN RIGHT', findRight.location)
              // right = true
            }
          }
        }*/
    /*    const update: CableModel = {
          ...cable,
          join_id: newJoinId,
        }

        return this.cablesEntity.update(update)*/
  }
}
