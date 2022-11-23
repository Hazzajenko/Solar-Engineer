import { Injectable } from '@angular/core'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { GridService } from './grid.service'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinsService } from '../joins.service'

@Injectable({
  providedIn: 'root',
})
export class GridDeleteService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
  ) {
    super(
      panelsEntity,
      cablesEntity,
      invertersEntity,
      joinsEntity,
      joinsService,
    )
  }

  deleteSwitch(
    location: string,
    gridState: {
      createMode?: UnitModel
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    },
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const toDelete = blocks.find((block) => block.location === location)
    if (!toDelete) return console.log('nothing to delete')

    switch (toDelete.model) {
      case UnitModel.PANEL:
        return this.panelsEntity.delete(toDelete.id!)
      case UnitModel.CABLE:
        return this.cablesEntity.delete(toDelete.id!)
      case UnitModel.INVERTER:
        return this.invertersEntity.delete(toDelete.id!)
      default:
        break
    }
  }
}
