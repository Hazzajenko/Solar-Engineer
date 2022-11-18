import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { CreateMode } from '../../store/grid/grid.actions'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { GridCreateService } from './grid-create.service'
import { GridUpdateService } from './grid-update.service'
import { GridDeleteService } from './grid-delete.service'

@Injectable({
  providedIn: 'root',
})
export class GridModeService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelEntity: PanelsEntityService,
    private cableEntity: CablesEntityService,
    private create: GridCreateService,
    private update: GridUpdateService,
    private remove: GridDeleteService,
  ) {}

  cellAction(
    location: string,
    gridState: {
      createMode?: CreateMode
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

      default:
        break
    }
  }
}
