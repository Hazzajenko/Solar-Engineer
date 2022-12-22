import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { TypeModel } from '../../models/type.model'
import { PanelModel } from '../../models/panel.model'
import { CableModel } from '../../models/deprecated-for-now/cable.model'
import { InverterModel } from '../../models/deprecated-for-now/inverter.model'
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
import { JoinModel } from '../../models/deprecated-for-now/join.model'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'

import { BlockModel } from '../../models/block.model'

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
  ) {}

  gridDrop(event: CdkDragDrop<any, any>) {
    firstValueFrom(this.store.select(selectBlocksByProjectIdRouteParams)).then((blocks) => {
      if (blocks) {
        const doesExist = blocks.find((block) => block.location.toString() === event.container.id)

        console.error(doesExist)
        if (doesExist) {
          return console.warn(`block already exists as ${event.container.id}`)
        }
        const block: BlockModel = event.item.data
        console.log(block)
        const location = event.container.id

        switch (block.type) {
          case TypeModel.PANEL:
            const panel: Partial<PanelModel> = {
              id: block.id,
              projectId: block.projectId,
              location,
              rotation: 0,
            }
            return this.panelsEntity.update(panel)
          case TypeModel.DISCONNECTIONPOINT:
            const disconnectionPoint: DisconnectionPointModel = {
              ...block,
              location,
            }
            return this.disconnectionPointsEntity.update(disconnectionPoint)

          case TypeModel.CABLE:
            this.joinNearbyCables(block, location)
            break

          case TypeModel.INVERTER:
            const inverter: InverterModel = {
              ...block,
              name: 'inv',
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
   /* if (!cable) {
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
      model: TypeModel.JOIN,
      size: 4,
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
    })*/
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
