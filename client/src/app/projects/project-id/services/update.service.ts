import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'
import { CableModel } from '../../models/cable.model'
import { InverterModel } from '../../models/inverter.model'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { Guid } from 'guid-typescript'
import { HttpClient } from '@angular/common/http'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../project-id/services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { getSurroundings } from './helper-functions'
import { JoinModel } from '../../models/join.model'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'
import { LoggerService } from '../../../services/logger.service'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(
    private http: HttpClient,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private panelsEntity: PanelsEntityService,
    private invertersEntity: InvertersEntityService,
    private cables: CablesEntityService,
    private joins: JoinsEntityService,
    private store: Store<AppState>,
    private logger: LoggerService,
  ) {}

  gridDrop(event: CdkDragDrop<any, any>) {
    firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      if (blocks) {
        const doesExist = blocks.find((block) => block.location.toString() === event.container.id)

        console.error(doesExist)
        if (doesExist && doesExist.model !== UnitModel.RAIL) {
          return this.logger.warn(`block already exists as ${event.container.id}`)
        }

        const block = event.item.data
        const location = event.container.id

        switch (block.model) {
          case UnitModel.PANEL:
            firstValueFrom(
              this.panelsEntity.entities$.pipe(
                map((panels) => panels.find((p) => p.id === block.id)),
              ),
            ).then((existingPanel) => {
              if (doesExist && doesExist.model === UnitModel.RAIL) {
                const panel: PanelModel = {
                  ...block,
                  location,
                  has_child_block: true,
                  child_block_id: doesExist.id,
                  child_block_model: UnitModel.RAIL,
                }
                return this.panelsEntity.update(panel)
              } else {
                const panel: Partial<PanelModel> = {
                  ...existingPanel,
                  location,
                  rotation: 0,
                  child_block_id: undefined,
                  child_block_model: undefined,
                }
                return this.panelsEntity.update(panel)
                /*                const panel: Partial<PanelModel> = {
                                  ...block,
                                  location,
                                }
                                return this.panelsEntity.update(panel)*/
                /*                if (existingPanel?.has_child_block) {
                                  if (doesExist && doesExist.model === UnitModel.RAIL) {
                                    const panel: Partial<PanelModel> = {
                                      ...existingPanel,
                                      location,
                                      rotation: 0,
                                      child_block_id: doesExist.id,
                                      child_block_model: UnitModel.RAIL,
                                    }
                                    return this.panelsEntity.update(panel)
                                  } else {
                                    const panel: Partial<PanelModel> = {
                                      ...existingPanel,
                                      location,
                                      rotation: 0,
                                      child_block_id: undefined,
                                      child_block_model: undefined,
                                    }
                                    return this.panelsEntity.update(panel)
                                  }
                                } else {
                                  const panel: Partial<PanelModel> = {
                                    ...block,
                                    location,
                                  }
                                  return this.panelsEntity.update(panel)
                                }*/
              }
            })
            break
          case UnitModel.DISCONNECTIONPOINT:
            const disconnectionPoint: DisconnectionPointModel = {
              ...block,
              location,
            }
            return this.disconnectionPointsEntity.update(disconnectionPoint)

          case UnitModel.CABLE:
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
    })
  }

  joinNearbyCables(cable: CableModel, location: string) {
    if (!cable) {
      return console.log('err')
    }
    let cables: CableModel[] = []

    this.cables.entities$.subscribe((cables$) => (cables = cables$))

    const surroundingCables = getSurroundings(location, cables)

    if (!surroundingCables) return console.log('joinNearbyCables surroundingCables err')

    const newJoinId = Guid.create().toString()

    const joinRequest: JoinModel = {
      id: newJoinId,
      project_id: 3,
      color: 'purple',
      model: UnitModel.JOIN,
      size: 4,
      type: 'JOIN',
    }
    lastValueFrom(this.joins.add(joinRequest)).then(() => {
      if (surroundingCables.topCable) {
        this.updateCableForJoin(surroundingCables.topCable, newJoinId, cables)
      }

      if (surroundingCables.bottomCable) {
        this.updateCableForJoin(surroundingCables.bottomCable, newJoinId, cables)
      }

      if (surroundingCables.leftCable) {
        this.updateCableForJoin(surroundingCables.leftCable, newJoinId, cables)
      }

      if (surroundingCables.rightCable) {
        this.updateCableForJoin(surroundingCables.rightCable, newJoinId, cables)
      }

      const update: CableModel = {
        ...cable,
        location,
        join_id: newJoinId,
      }
      this.cables.update(update)
    })
  }

  updateCableForJoin(cable: CableModel, join_id: string, cables: CableModel[]) {
    if (!cable) return console.log('updateCableForJoin err')
    const otherBlock: CableModel = {
      ...cable!,
      join_id,
    }
    this.cables.update(otherBlock)

    const cablesInJoin = cables.filter((cableInJoin) => cableInJoin.join_id === cable.join_id)
    const updates = cablesInJoin.map((cableInJoin) => {
      const partial: Partial<CableModel> = {
        ...cableInJoin,
        join_id,
      }
      return partial
    })
    this.cables.updateManyInCache(updates)
    return this.http.put(`/api/projects/${cable.project_id!}/join/${cable.join_id!}/cables`, {
      project_id: cable.project_id!,
      changes: {
        new_join_id: join_id,
        old_join_id: cable.join_id!,
      },
    })
  }
}
