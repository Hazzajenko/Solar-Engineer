import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'
import { CableModel } from '../../models/cable.model'
import { InverterModel } from '../../models/inverter.model'
import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { Guid } from 'guid-typescript'
import { LinksService } from '../../project-id/services/links/links.service'
import { HttpClient } from '@angular/common/http'
import { GridHelpers } from './grid.helpers'
import { LoggerService } from '../../../services/logger.service'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../project-id/services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridUpdateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: LinksService,
    logger: LoggerService,
    private http: HttpClient,
    private gridHelpers: GridHelpers,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
  ) {
    super(
      panelsEntity,
      cablesEntity,
      invertersEntity,
      joinsEntity,
      joinsService,
      logger,
    )
  }

  gridDrop(
    event: CdkDragDrop<any, any>,
    project: ProjectModel,
    blocks?: BlockModel[],
  ) {
    if (blocks) {
      const doesExist = blocks.find(
        (block) => block.location.toString() === event.container.id,
      )

      if (doesExist) {
        return console.log('location taken')
      }
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

      case UnitModel.DISCONNECTIONPOINT:
        const disconnectionPoint: DisconnectionPointModel = {
          ...block,
          location,
        }
        return this.disconnectionPointsEntity.update(disconnectionPoint)

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
      return console.log('err')
    }
    let cables: CableModel[] = []

    this.cablesEntity.entities$.subscribe((cables$) => (cables = cables$))

    const surroundingCables = this.gridHelpers.getSurroundings(location, cables)

    if (!surroundingCables)
      return console.log('joinNearbyCables surroundingCables err')

    const newJoinId = Guid.create().toString()

    /*this.joinsService.createJoin(cable.project_id!, newJoinId).then(() => {
      if (surroundingCables.topCable) {
        this.updateCableForJoin(surroundingCables.topCable, newJoinId, cables)
      }

      if (surroundingCables.bottomCable) {
        this.updateCableForJoin(
          surroundingCables.bottomCable,
          newJoinId,
          cables,
        )
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
      this.cablesEntity.update(update)
    })*/
  }

  updateCableForJoin(cable: CableModel, join_id: string, cables: CableModel[]) {
    if (!cable) return console.log('updateCableForJoin err')
    const otherBlock: CableModel = {
      ...cable!,
      join_id,
    }
    this.cablesEntity.update(otherBlock)

    const cablesInJoin = cables.filter(
      (cableInJoin) => cableInJoin.join_id === cable.join_id,
    )
    const updates = cablesInJoin.map((cableInJoin) => {
      const partial: Partial<CableModel> = {
        ...cableInJoin,
        join_id,
      }
      return partial
    })
    this.cablesEntity.updateManyInCache(updates)
    return this.http
      .put(`/api/projects/${cable.project_id!}/join/${cable.join_id!}/cables`, {
        project_id: cable.project_id!,
        changes: {
          new_join_id: join_id,
          old_join_id: cable.join_id!,
        },
      })
      .subscribe((res) => {})
  }
}
