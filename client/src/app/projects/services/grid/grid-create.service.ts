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
import { PanelModel } from '../../models/panel.model'
import { Guid } from 'guid-typescript'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { CableModel } from '../../models/cable.model'

@Injectable({
  providedIn: 'root',
})
export class GridCreateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelEntity: PanelsEntityService,
    private cableEntity: CablesEntityService,
  ) {}

  createSwitch(
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
    switch (gridState.createMode) {
      case CreateMode.PANEL:
        return this.createPanelForGrid(
          project,
          location,
          gridState.selectedString!,
          gridState.gridMode!,
          blocks,
        )

      case CreateMode.CABLE:
        return this.createCableForGrid(
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
    if (selectedString.id < 1) console.log('error with selected string')

    if (selectedString) {
      const doesExist = blocks.find((block) => block.location === location)
      if (doesExist) {
        return console.log('cell location taken')
      }

      /*      const request: CreatePanelRequest = {
              project_id: selectedString.project_id,
              inverter_id: selectedString.inverter_id,
              tracker_id: selectedString.tracker_id,
              string_id: selectedString.id,
              location,
            }*/

      const panelRequest: PanelModel = {
        id: Guid.create().toString(),
        // project_id: selectedString.project_id,
        inverter_id: selectedString.inverter_id,
        tracker_id: selectedString.tracker_id,
        string_id: selectedString.id,
        location,
      }

      this.panelEntity.add(panelRequest)
      // this.store.dispatch(PanelStateActions.addPanelHttp({ request }))
    }
  }

  createCableForGrid(
    project: ProjectModel,
    location: string,
    gridMode: GridMode,
    blocks: BlockModel[],
  ) {
    const doesExist = blocks.find((block) => block.location === location)
    if (doesExist) {
      return console.log('cell location taken')
    }

    /*    const request: CreateCableRequest = {
      location,
      size: 4,
      project_id: project.id,
    }*/

    const cableRequest: CableModel = {
      id: Guid.create().toString(),
      // project_id: project.id,
      location,
      size: 4,
      model: UnitModel.CABLE,
      type: 'CABLE',
      color: 'black',
    }

    this.cableEntity.add(cableRequest)
    // this.store.dispatch(CableStateActions.addCableHttp({ request }))
  }
}
