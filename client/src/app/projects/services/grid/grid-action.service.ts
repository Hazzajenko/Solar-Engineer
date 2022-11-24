import { Injectable } from '@angular/core'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { GridService } from './grid.service'
import { GridCreateService } from './grid-create.service'
import { GridDeleteService } from './grid-delete.service'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { GridJoinService } from './grid-join.service'
import { JoinsService } from '../joins.service'
import { LoggerService } from '../../../services/logger.service'
import { PanelModel } from '../../models/panel.model'

@Injectable({
  providedIn: 'root',
})
export class GridActionService extends GridService {
  /*  protected create: GridCreateService
    protected remove: GridDeleteService*/

  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
    private create: GridCreateService,
    private join: GridJoinService,
    private remove: GridDeleteService,
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

  cellAction(
    location: string,
    joinArray: string[],
    panelsToJoin: PanelModel[],
    gridState: {
      createMode?: UnitModel
      selectedStrings?: StringModel[]
      selectedString?: StringModel
      gridMode?: GridMode
    },
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    switch (gridState.gridMode) {
      case GridMode.CREATE:
        return this.create.createSwitch(location, gridState, project, blocks)

      case GridMode.DELETE:
        return this.remove.deleteSwitch(location, gridState, project, blocks)

      case GridMode.JOIN:
        return this.join.addPanelToJoin(location, panelsToJoin, project, blocks)
      // return this.join.addToJoinArray(location, joinArray, project, blocks)

      default:
        break
    }
  }
}
