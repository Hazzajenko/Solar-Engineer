import { Injectable } from '@angular/core'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { Guid } from 'guid-typescript'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { GridService } from './grid.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinModel } from '../../models/join.model'
import { UnitModel } from '../../models/unit.model'
import { CableModel } from '../../models/cable.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { GridStateActions } from '../../store/grid/grid.actions'
import { GridMode } from '../../store/grid/grid-mode.model'

@Injectable({
  providedIn: 'root',
})
export class GridJoinService extends GridService {
  joinArray: string[] = []

  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    private store: Store<AppState>,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity)
  }

  startJoin(location: string, project: ProjectModel, blocks: BlockModel[]) {
    const existing = blocks.find((block) => block.location === location)
    if (!existing) return console.log('no block to add toJoinArray')

    this.joinArray.push(location)

    this.store.dispatch(
      GridStateActions.changeGridmode({ mode: GridMode.JOIN }),
    )

    return this.store.dispatch(
      GridStateActions.addToJoinArray({ toJoin: location }),
    )
  }

  finishJoin(location: string, project: ProjectModel, blocks: BlockModel[]) {
    const existing = blocks.find((block) => block.location === location)
    if (!existing) return console.log('no block to add toJoinArray')

    // const inSurroundings = this.isBlockInSurrounding(location, blocks)

    // if (!inSurroundings) return console.log('second block not in surroundings')

    return this.store.dispatch(
      GridStateActions.addToJoinArray({ toJoin: location }),
    )
  }

  addToJoinArray(
    location: string,
    joinArray: string[],
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const existing = blocks.find((block) => block.location === location)
    if (!existing) return console.log('no block to add toJoinArray')
    if (joinArray.length === 0) {
      return this.store.dispatch(
        GridStateActions.addToJoinArray({ toJoin: location }),
      )
    }
    if (joinArray) {
      joinArray.forEach((join) => {
        if (this.isBlockInSurrounding(location, join, blocks)) {
          return this.store.dispatch(
            GridStateActions.addToJoinArray({ toJoin: location }),
          )
        }
      })
    }
  }

  async createJoin(vm: {
    toJoinArray: string[] | null
    blocks: BlockModel[] | null
    project: ProjectModel | undefined | null
    cables: CableModel[] | null
  }) {
    if (!vm.toJoinArray) return
    if (!vm.blocks) return
    if (!vm.project) return
    if (!vm.cables) return

    const joinId = Guid.create().toString()

    const joinRequest: JoinModel = {
      id: joinId,
      project_id: vm.project.id,
      color: 'purple',
      blocks: vm.toJoinArray,
      model: UnitModel.JOIN,
      size: 4,
      type: 'JOIN',
    }

    await this.joinsEntity.add(joinRequest)

    let getCables: CableModel[] = []
    const subscription = this.cablesEntity.entities$.subscribe((cables) => {
      console.log(cables)
      return (getCables = cables)
    })
    console.log(getCables)
    const cablesToJoin = getCables.filter(
      (cable) =>
        vm.toJoinArray!.includes(cable.location) &&
        cable.model === UnitModel.CABLE,
    )
    cablesToJoin.forEach((join) => {
      const update: CableModel = {
        ...join,
        join_id: joinId,
      }
      console.log(update)
      return this.cablesEntity.update(update)
    })
    console.log(cablesToJoin)
    return subscription.unsubscribe()
  }

  private isBlockInSurrounding(
    location: string,
    existing: string,
    blocks: BlockModel[],
  ): boolean {
    if (!location || !blocks) {
      return false
    }

    let numberRow: number = 0
    let numberCol: number = 0

    // const location = cable.location
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

    const findTop = blocks.find(
      (block) => block.location === topString && block.location === existing,
    )
    const findBottom = blocks.find(
      (block) => block.location === bottomString && block.location === existing,
    )
    const findLeft = blocks.find(
      (block) => block.location === leftString && block.location === existing,
    )
    const findRight = blocks.find(
      (block) => block.location === rightString && block.location === existing,
    )

    if (findTop) console.log('FIND TOP', findTop.location)
    if (findBottom) console.log('FIND BOTTOM', findBottom.location)
    if (findLeft) console.log('FIND LEFT', findLeft.location)
    if (findRight) console.log('FIND RIGHT', findRight.location)

    if (findTop) return true
    if (findBottom) return true
    if (findLeft) return true
    return !!findRight
  }
}
