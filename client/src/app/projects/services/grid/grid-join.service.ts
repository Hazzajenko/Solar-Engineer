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

@Injectable({
  providedIn: 'root',
})
export class GridJoinService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    private store: Store<AppState>,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity)
  }

  addToJoinArray(
    location: string,
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const existing = blocks.find((block) => block.location === location)
    if (!existing) return console.log('no block to add toJoinArray')

    return this.store.dispatch(
      GridStateActions.addToJoinArray({ toJoin: location }),
    )
  }

  createJoin(vm: {
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
      model: UnitModel.JOIN,
      size: 0,
      type: 'JOIN',
    }

    this.joinsEntity.add(joinRequest)

    /*    const selectedBlocks = vm.blocks.filter(
          (block) =>
            vm.toJoinArray!.includes(block.location) &&
            block.model === UnitModel.CABLE,
        )

        const cables = vm.toJoinArray.map((toJoin) => {
          const shitFuck = vm.cables!.find((cable) => {
            cable.location === toJoin
          })
          console.log(shitFuck)
        })
        console.log(cables)
        const selectedCables = vm.cables.filter((cable) => {
          vm.toJoinArray!.includes(cable.location)
        })
        console.log(selectedCables)*/

    /*    selectedCables.map((cable) => {
          const update: Update<CableModel> = {
            id: cable.id,
            changes: { ...cable, join_id: joinId },
          }
          console.log(update)
          return this.cablesEntity.update(update)
          // return update
        })*/
    let getCables: CableModel[] = []
    const subscription = this.cablesEntity.entities$.subscribe((cables) => {
      console.log(cables)
      return (getCables = cables)
      /*      const updates = selectedBlocks.map((block) => {
              const cable = cables.find((cable) => cable.id === block.id)
              const update: Partial<CableModel> = {
                ...cable,
                join_id: joinId,
              }
              return update
            })
            console.log(updates)
            this.cablesEntity.updateManyInCache(updates)*/
    })
    console.log(getCables)
    const cablesToJoin = getCables.filter(
      (cable) =>
        vm.toJoinArray!.includes(cable.location) &&
        cable.model === UnitModel.CABLE,
    )
    cablesToJoin.forEach((join) => {
      // join.join_id = joinId
      const update: CableModel = {
        ...join,
        join_id: joinId,
      }
      /*      const update: Update<CableModel> = {
              id: join.id,
              changes: { join_id: joinId },
            }*/
      console.log(update)
      return this.cablesEntity.update(update)
    })
    console.log(cablesToJoin)
    return subscription.unsubscribe()

    // this.cablesEntity.updateManyInCache(updates)
    // this.cablesEntity.update(updates)

    /*    const subscription = this.cablesEntity.entities$.subscribe((cables) => {
          const updates = selectedBlocks.map((block) => {
            const cable = cables.find((cable) => cable.id === block.id)
            const update: Partial<CableModel> = {
              ...cable,
              join_id: joinId,
            }
            return update
          })
          console.log(updates)
          this.cablesEntity.updateManyInCache(updates)
        })

        return subscription.unsubscribe()*/
  }
}
