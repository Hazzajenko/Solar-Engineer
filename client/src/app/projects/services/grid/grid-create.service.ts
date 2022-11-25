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
import { JoinsService } from '../joins.service'
import { GridHelpers } from './grid.helpers'
import { GridUpdateService } from './grid-update.service'
import { LoggerService } from '../../../services/logger.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectBlocksByProjectId } from '../../store/blocks/blocks.selectors'
import { combineLatest, lastValueFrom } from 'rxjs'
import { selectSelectedString } from '../../store/grid/grid.selectors'
import { StringsEntityService } from '../../project-id/services/strings-entity/strings-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridCreateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
    private gridHelpers: GridHelpers,
    private gridUpdate: GridUpdateService,
    private store: Store<AppState>,
    private stringsEntity: StringsEntityService,
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
        return this.createPanelForGridV2(project, location)
      /*        return this.createPanelForGrid(
                project,
                location,
                gridState.selectedString!,
                gridState.gridMode!,
                blocks,
              )*/

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

  createPanelForGridV2(project: ProjectModel, location: string) {
    let blocks: BlockModel[] | undefined
    let selectedString: StringModel | undefined

    combineLatest([
      this.store.select(selectBlocksByProjectId({ projectId: project.id })),
      this.store.select(selectSelectedString),
    ]).subscribe(([blocks$, selectedString$]) => {
      blocks = blocks$
      selectedString = selectedString$
    })

    const existing = blocks?.find((block) => block.location === location)
    if (existing) return console.log('spot taken')

    if (selectedString) {
      const panelRequest: PanelModel = {
        id: Guid.create().toString(),
        inverter_id: selectedString.inverter_id,
        tracker_id: selectedString.tracker_id,
        string_id: selectedString.id,
        location,
      }

      this.panelsEntity.add(panelRequest)
    } else {
      const stringRequest: StringModel = {
        id: Guid.create().toString(),
        name: 'string',
        is_in_parallel: false,
        project_id: project.id,
        color: 'black',
        model: UnitModel.STRING,
      }

      lastValueFrom(this.stringsEntity.add(stringRequest)).then((res) => {
        const panelRequest: PanelModel = {
          id: Guid.create().toString(),
          string_id: res.id,
          location,
        }

        this.panelsEntity.add(panelRequest)
      })
    }
  }

  createCableForGrid(
    project: ProjectModel,
    location: string,
    gridMode: GridMode,
    blocks: BlockModel[],
  ) {
    let cables: CableModel[] = []

    this.cablesEntity.entities$.subscribe((cables$) => (cables = cables$))

    const surroundingCables = this.gridHelpers.getSurroundings(location, cables)

    if (!surroundingCables)
      return console.log('joinNearbyCables surroundingCables err')

    const newJoinId = Guid.create().toString()

    this.joinsService.createJoin(project.id!, newJoinId).then(() => {
      if (surroundingCables.topCable) {
        this.gridUpdate.updateCableForJoin(
          surroundingCables.topCable,
          newJoinId,
          cables,
        )
      }

      if (surroundingCables.bottomCable) {
        this.gridUpdate.updateCableForJoin(
          surroundingCables.bottomCable,
          newJoinId,
          cables,
        )
      }

      if (surroundingCables.leftCable) {
        this.gridUpdate.updateCableForJoin(
          surroundingCables.leftCable,
          newJoinId,
          cables,
        )
      }

      if (surroundingCables.rightCable) {
        this.gridUpdate.updateCableForJoin(
          surroundingCables.rightCable,
          newJoinId,
          cables,
        )
      }

      const cableRequest: CableModel = {
        id: Guid.create().toString(),
        location,
        size: 4,
        join_id: newJoinId,
        model: UnitModel.CABLE,
        type: 'CABLE',
        color: 'black',
      }

      this.cablesEntity.add(cableRequest)
    })
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
