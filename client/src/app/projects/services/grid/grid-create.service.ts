import { Injectable } from '@angular/core'
import { StringModel } from '../../models/string.model'
import { GridMode } from '../../project-id/services/store/grid/grid-mode.model'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { TypeModel } from '../../models/type.model'
import { PanelModel } from '../../models/panel.model'
import { Guid } from 'guid-typescript'
import { CableModel } from '../../models/deprecated-for-now/cable.model'
import { InverterModel } from '../../models/deprecated-for-now/inverter.model'
import { GridService } from './grid.service'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { LinksService } from '../../project-id/services/links/links.service'
import { GridHelpers } from './grid.helpers'
import { GridUpdateService } from './grid-update.service'
import { LoggerService } from '../../../services/logger.service'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { selectBlocksByProjectId } from '../../project-id/services/store/blocks/blocks.selectors'
import { combineLatest, lastValueFrom } from 'rxjs'
import { selectSelectedString } from '../../project-id/services/store/grid/grid.selectors'
import { StringsEntityService } from '../../project-id/services/ngrx-data/strings-entity/strings-entity.service'
import {
  DisconnectionPointModel,
  DisconnectionPointType,
} from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../project-id/services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridCreateService extends GridService {
  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: LinksService,
    logger: LoggerService,
    private gridHelpers: GridHelpers,
    private gridUpdate: GridUpdateService,
    private store: Store<AppState>,
    private stringsEntity: StringsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity, joinsService, logger)
  }

  createSwitch(
    location: string,
    createMode: TypeModel,
    project: ProjectModel,
    blocks?: BlockModel[],
  ) {
    if (blocks) {
      const doesExist = blocks.find((block) => block.location === location)
      if (doesExist) {
        return console.log('cell location taken')
      }
    }

    switch (createMode) {
      case TypeModel.PANEL:
        return this.createPanelForGridV2(project, location)

      case TypeModel.CABLE:
        return this.createCableForGrid(project, location)

      case TypeModel.DISCONNECTIONPOINT:
        return this.createDisconnectionPointForGrid(project, location)

      case TypeModel.INVERTER:
        return this.createInverterForGrid(project, location)
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
        inverterId: selectedString.inverterId,
        trackerId: selectedString.trackerId,
        stringId: selectedString.id,
        location,
        rotation: 0,
      }

      this.panelsEntity.add(panelRequest)
    }
  }

  createDisconnectionPointForGrid(project: ProjectModel, location: string) {
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
      const disconnectionPointModel: DisconnectionPointModel = {
        id: Guid.create().toString(),
        projectId: project.id,
        stringId: selectedString.id,
        disconnectionPointType: DisconnectionPointType.MC4,
        positiveId: 'undefined',
        negativeId: 'undefined',
        location,
        type: TypeModel.DISCONNECTIONPOINT,
        color: 'black',
      }

      this.disconnectionPointsEntity.add(disconnectionPointModel)
    } else {
      const stringRequest: StringModel = {
        id: Guid.create().toString(),
        name: 'string',
        isInParallel: false,
        projectId: project.id,
        color: 'black',
        type: TypeModel.STRING,
      }

      lastValueFrom(this.stringsEntity.add(stringRequest)).then((res) => {
        const disconnectionPointModel: DisconnectionPointModel = {
          id: Guid.create().toString(),
          projectId: project.id,
          stringId: res.id,
          disconnectionPointType: DisconnectionPointType.MC4,
          positiveId: 'undefined',
          negativeId: 'undefined',
          location,
          color: 'black',
          type: TypeModel.DISCONNECTIONPOINT,
        }

        this.disconnectionPointsEntity.add(disconnectionPointModel)
      })
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
        inverterId: selectedString.inverterId,
        trackerId: selectedString.trackerId,
        stringId: selectedString.id,
        location,
        rotation: 0,
      }

      this.panelsEntity.add(panelRequest)
    } else {
      const stringRequest: StringModel = {
        id: Guid.create().toString(),
        name: 'string',
        isInParallel: false,
        projectId: project.id,
        color: 'black',
        type: TypeModel.STRING,
      }

      lastValueFrom(this.stringsEntity.add(stringRequest)).then((res) => {
        const panelRequest: PanelModel = {
          id: Guid.create().toString(),
          stringId: res.id,
          location,
          rotation: 0,
        }

        this.panelsEntity.add(panelRequest)
      })
    }
  }

  createCableForGrid(project: ProjectModel, location: string) {
    let cables: CableModel[] = []

    this.cablesEntity.entities$.subscribe((cables$) => (cables = cables$))

    const surroundingCables = this.gridHelpers.getSurroundings(location, cables)

    if (!surroundingCables) return console.log('joinNearbyCables surroundingCables err')

    const newJoinId = Guid.create().toString()

    /*this.joinsService.createJoin(project.id!, newJoinId).then(() => {
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
    })*/
  }

  private createInverterForGrid(project: ProjectModel, location: string) {
    const inverterRequest: InverterModel = {
      id: Guid.create().toString(),
      projectId: project.id,
      location,
      model: TypeModel.INVERTER,
      color: 'blue',
      name: 'New Inverter',
    }

    this.invertersEntity.add(inverterRequest)
  }
}
