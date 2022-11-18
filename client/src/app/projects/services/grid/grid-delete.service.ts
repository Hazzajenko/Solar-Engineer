import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { CreateMode } from '../../store/grid/grid.actions'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridDeleteService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelEntity: PanelsEntityService,
    private cableEntity: CablesEntityService,
  ) {}

  deleteSwitch(
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
    const toDelete = blocks.find((block) => block.location === location)
    if (!toDelete) return console.log('nothing to delete')

    switch (toDelete.model) {
      case UnitModel.PANEL:
        return this.panelEntity.delete(toDelete.id!)
      case UnitModel.CABLE:
        return this.cableEntity.delete(toDelete.id!)
      default:
        break
    }
  }
}
