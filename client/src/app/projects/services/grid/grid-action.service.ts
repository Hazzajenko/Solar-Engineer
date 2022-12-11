import { Injectable } from '@angular/core'
import { GridMode } from '../../project-id/services/store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { TypeModel } from '../../models/type.model'
import { GridService } from './grid.service'
import { GridCreateService } from './grid-create.service'
import { GridDeleteService } from './grid-delete.service'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { GridJoinService } from './grid-join.service'
import { LinksService } from '../../project-id/services/links/links.service'
import { LoggerService } from '../../../services/logger.service'

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
    joinsService: LinksService,
    logger: LoggerService,
    private create: GridCreateService,
    private join: GridJoinService,
    private remove: GridDeleteService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity, joinsService, logger)
  }

  cellAction(
    location: string,
    modes: {
      createMode: TypeModel
      gridMode: GridMode
    },
    project: ProjectModel,
    blocks?: BlockModel[],
  ): void {
    switch (modes.gridMode) {
      case GridMode.CREATE:
        this.create.createSwitch(location, modes.createMode, project, blocks!)
        break

      case GridMode.DELETE:
        this.remove.deleteSwitch(location, project, blocks!)
        break

      case GridMode.LINK:
        // this.join.joinSwitch(location, project, blocks!)
        break
      // return this.join.addPanelToJoin(location, panelsToJoin, project, blocks)
      // return this.join.addToJoinArray(location, joinArray, project, blocks)

      default:
        break
    }
  }
}
