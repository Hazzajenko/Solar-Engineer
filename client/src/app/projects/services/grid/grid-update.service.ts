import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { PanelModel } from '../../models/panel.model'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { CableModel } from '../../models/cable.model'
import { CdkDragDrop } from '@angular/cdk/drag-drop'

@Injectable({
  providedIn: 'root',
})
export class GridUpdateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private cablesEntity: CablesEntityService,
  ) {}

  gridDrop(
    event: CdkDragDrop<any, any>,
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const doesExist = blocks.find(
      (block) => block.location.toString() === event.container.id,
    )

    if (doesExist) {
      return console.log('location taken')
    }

    const newLocation = Number(event.container.id)

    const block = event.item.data
    switch (block.model) {
      case UnitModel.PANEL:
        return this.updatePanel(project.id, block, event.container.id)
      case UnitModel.CABLE:
        return this.updateCable(project.id, block, event.container.id)
      default:
        break
    }
  }

  updatePanel(projectId: number, panel: PanelModel, newLocation: string) {
    const update: PanelModel = {
      ...panel,
      location: newLocation,
    }

    return this.panelsEntity.update(update)
  }

  updateCable(projectId: number, cable: CableModel, newLocation: string) {
    const update: CableModel = {
      ...cable,
      location: newLocation,
    }

    return this.cablesEntity.update(update)
  }
}
