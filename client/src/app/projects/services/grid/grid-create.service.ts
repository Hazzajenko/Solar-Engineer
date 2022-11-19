import { Injectable } from '@angular/core'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { UnitModel } from '../../models/unit.model'
import { PanelModel } from '../../models/panel.model'
import { Guid } from 'guid-typescript'
import { CableModel } from '../../models/cable.model'
import { InverterModel } from '../../models/inverter.model'
import { GridService } from './grid.service'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridCreateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity)
  }

  createSwitch(
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
    const doesExist = blocks.find((block) => block.location === location)
    if (doesExist) {
      return console.log('cell location taken')
    }

    switch (gridState.createMode) {
      case UnitModel.PANEL:
        return this.createPanelForGrid(
          project,
          location,
          gridState.selectedString!,
          gridState.gridMode!,
          blocks,
        )

      case UnitModel.CABLE:
        return this.createCableForGrid(
          project,
          location,
          gridState.gridMode!,
          blocks,
        )

      case UnitModel.INVERTER:
        return this.createInverterForGrid(
          project,
          location,
          gridState.gridMode!,
          blocks,
        )
      default:
        break
    }
  }

  createPanelForGrid(
    project: ProjectModel,
    location: string,
    selectedString: StringModel,
    gridMode: GridMode,
    blocks: BlockModel[],
  ) {
    if (!selectedString) return console.log('please select a string')
    if (selectedString.id === 'err') console.log('error with selected string')

    if (selectedString) {
      const panelRequest: PanelModel = {
        id: Guid.create().toString(),
        inverter_id: selectedString.inverter_id,
        tracker_id: selectedString.tracker_id,
        string_id: selectedString.id,
        location,
      }

      this.panelsEntity.add(panelRequest)
    }
  }

  createCableForGrid(
    project: ProjectModel,
    location: string,
    gridMode: GridMode,
    blocks: BlockModel[],
  ) {
    const cableRequest: CableModel = {
      id: Guid.create().toString(),
      location,
      size: 4,
      model: UnitModel.CABLE,
      type: 'CABLE',
      color: 'black',
    }

    this.cablesEntity.add(cableRequest)
  }

  private createInverterForGrid(
    project: ProjectModel,
    location: string,
    gridMode: GridMode,
    blocks: BlockModel[],
  ) {
    const inverterRequest: InverterModel = {
      id: Guid.create().toString(),
      location,
      model: UnitModel.INVERTER,
      color: 'blue',
      name: 'New Inverter',
    }

    this.invertersEntity.add(inverterRequest)
  }
}
