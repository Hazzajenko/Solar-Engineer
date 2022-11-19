import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'
import { CableModel } from '../../models/cable.model'
import { InverterModel } from '../../models/inverter.model'
import { GridService } from './grid.service'
import { Injectable } from '@angular/core'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridUpdateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity)
  }

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

    const block = event.item.data
    const location = event.container.id

    const split = location.split(['a', 'b'][1])
    const splice = location.slice(0, 1)
    console.log('splice', splice)
    const row = location.slice(1, 4)
    console.log('row', row)
    console.log('split', split)
    let replace = location.replace('a', '')
    replace = replace.replace('b', '')
    console.log(replace)
    const again = split[0].split('a')
    console.log(again)

    // tmp.splice(i - 1, 1) // remove 1 element from the array (adjusting for non-zero-indexed counts)
    // return tmp.join('') // reconstruct the string

    switch (block.model) {
      case UnitModel.PANEL:
        const panel: PanelModel = {
          ...block,
          location,
        }
        return this.panelsEntity.update(panel)

      case UnitModel.CABLE:
        const cable: CableModel = {
          ...block,
          location,
        }
        return this.cablesEntity.update(cable)

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
}
