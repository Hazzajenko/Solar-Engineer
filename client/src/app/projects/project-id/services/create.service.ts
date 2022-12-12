import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { combineLatestWith, firstValueFrom, lastValueFrom } from 'rxjs'
import { PanelModel } from '../../models/panel.model'
import { InverterModel } from '../../models/deprecated-for-now/inverter.model'
import { TypeModel } from '../../models/type.model'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'
import { selectCreateMode } from './store/grid/grid.selectors'
import { Guid } from 'guid-typescript'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { CableModel } from '../../models/deprecated-for-now/cable.model'
import {
  DisconnectionPointModel,
  DisconnectionPointType,
} from '../../models/disconnection-point.model'
import { StringsEntityService } from './ngrx-data/strings-entity/strings-entity.service'
import { selectCurrentProjectId } from './store/projects/projects.selectors'
import { CablesEntityService } from './ngrx-data/cables-entity/cables-entity.service'
import { JoinModel } from '../../models/deprecated-for-now/join.model'
import { JoinsEntityService } from './ngrx-data/joins-entity/joins-entity.service'
import { getSurroundings } from './helper-functions'
import { UpdateService } from './update.service'
import { DisconnectionPointsEntityService } from './ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { InvertersEntityService } from './ngrx-data/inverters-entity/inverters-entity.service'
import { TrayModel } from '../../models/deprecated-for-now/tray.model'
import { TraysEntityService } from './ngrx-data/trays-entity/trays-entity.service'
import {
  selectSelectedStringId,
  selectSelectedUnitAndIds,
} from './store/selected/selected.selectors'
import { RailModel } from '../../models/deprecated-for-now/rail.model'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'
import { BlocksEntityService } from './ngrx-data/blocks-entity/blocks-entity.service'
import { BlockModel } from '../../models/block.model'
import { map } from 'rxjs/operators'
import { PanelsHelperService } from './ngrx-data/panels-entity/panels.service'

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private update: UpdateService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private cablesEntity: CablesEntityService,
    private joinsEntity: JoinsEntityService,
    private dp: DisconnectionPointsEntityService,
    private inverters: InvertersEntityService,
    private traysEntity: TraysEntityService,
    private railsEntity: RailsEntityService,
    private blocksEntity: BlocksEntityService,
    private panelsService: PanelsHelperService,
  ) {}

  createSwitch(location: string) {
    firstValueFrom(
      this.store
        .select(selectBlocksByProjectIdRouteParams)
        .pipe(combineLatestWith(this.store.select(selectCreateMode))),
    ).then(([blocks, createMode]) => {
      const doesExist = blocks.find((block) => block.location === location)
      if (doesExist) {
        return console.log('cell location taken')
      }

      switch (createMode) {
        case TypeModel.PANEL:
          return this.createPanelForGrid(location)

        case TypeModel.CABLE:
          return this.createCableForGrid(location)

        case TypeModel.DISCONNECTIONPOINT:
          return this.createDisconnectionPointForGrid(location)

        case TypeModel.INVERTER:
          return this.createInverterForGrid(location)

        case TypeModel.TRAY:
          return this.createTrayForGrid(location)
        case TypeModel.RAIL:
          return this.createRailForGrid(location, doesExist)
        default:
          break
      }
    })
  }

  async createPanelForGrid(location: string, childBlock?: BlockModel) {
    const [selected, projectID] = await firstValueFrom(
      this.store
        .select(selectSelectedUnitAndIds)
        .pipe(combineLatestWith(this.store.select(selectCurrentProjectId))),
    )
    if (childBlock) {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    } else {
      if (!selected.singleSelectId && selected.type !== TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, 'undefined', 0)

        this.panelsEntity.add(panelRequest)
      } else if (selected.singleSelectId && selected.type === TypeModel.STRING) {
        const panelRequest = new PanelModel(projectID, location, selected.selectedStringId!, 0)

        this.panelsEntity.add(panelRequest)
      }
    }

    /*firstValueFrom(this.store.select(selectSelectedUnitAndIds)).then((state) => {
      if (childBlock) {
        if (!state.singleSelectId && state.type !== TypeModel.STRING) {
          console.log('        if (!selectedStringId) {')
          // const panelRequest = new PanelModel(location, 'undefined', 0)
          const panelRequest = this.panelsService.createPanelWithDefaultValues(
            location,
            'undefined',
            0,
          )

          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: 'undefined',
                      location,
                      rotation: 0,
                      // has_child_block: true,
                      child_block_id: childBlock.id,
                      child_block_model: childBlock.model,
                    }*!/

          this.panelsEntity.add(panelRequest)
        } else if (state.singleSelectId && state.type === TypeModel.STRING) {
          console.log('        } else if (selectedStringId.length > 0) {')
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: state.selectedStringId!,
                      location,
                      rotation: 0,
                      // has_child_block: false,
                      child_block_id: childBlock.id,
                      child_block_model: childBlock.model,
                    }*!/
          const panelRequest = new PanelModel(location, state.selectedStringId!, 0)

          this.panelsEntity.add(panelRequest)
        }
      } else {
        if (!state.singleSelectId && state.type !== TypeModel.STRING) {
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: 'undefined',
                      location,
                      rotation: 0,
                    }*!/
          const panelRequest = new PanelModel(location, 'undefined', 0)

          this.panelsEntity.add(panelRequest)
          // this.store.dispatch(PanelStateActions.addPanel({ panel: panelRequest }))
        } else if (state.singleSelectId && state.type === TypeModel.STRING) {
          /!*          const panelRequest: PanelModel = {
                      id: Guid.create().toString(),
                      stringId: state.selectedStringId!,
                      location,
                      rotation: 0,
                    }*!/
          const panelRequest = new PanelModel(location, state.selectedStringId!, 0)

          this.panelsEntity.add(panelRequest)
        }
      }
    })*/
  }

  createCableForGrid(location: string) {
    firstValueFrom(
      this.cablesEntity.entities$.pipe(
        combineLatestWith(this.store.select(selectCurrentProjectId)),
      ),
    ).then(([cables, projectId]) => {
      const surroundingCables = getSurroundings(location, cables)

      if (!surroundingCables) return console.log('joinNearbyCables surroundingCables err')

      const newJoinId = Guid.create().toString()

      const joinRequest: JoinModel = {
        id: newJoinId,
        project_id: projectId,
        color: 'purple',
        model: TypeModel.JOIN,
        size: 4,
      }
      /*      return new Promise<JoinModel>((resolve, reject) =>
              this.joinsEntity.add(joinRequest)*/
      lastValueFrom(this.joinsEntity.add(joinRequest)).then(() => {
        if (surroundingCables.topCable) {
          this.update.updateCableForJoin(surroundingCables.topCable, newJoinId, cables)
        }

        if (surroundingCables.bottomCable) {
          this.update.updateCableForJoin(surroundingCables.bottomCable, newJoinId, cables)
        }

        if (surroundingCables.leftCable) {
          this.update.updateCableForJoin(surroundingCables.leftCable, newJoinId, cables)
        }

        if (surroundingCables.rightCable) {
          this.update.updateCableForJoin(surroundingCables.rightCable, newJoinId, cables)
        }

        const cableRequest: CableModel = {
          id: Guid.create().toString(),
          location,
          size: 4,
          join_id: newJoinId,
          model: TypeModel.CABLE,
          color: 'black',
        }

        this.cablesEntity.add(cableRequest)
      })
    })
  }

  createDisconnectionPointForGrid(location: string) {
    firstValueFrom(this.store.select(selectSelectedStringId)).then((stringId) => {
      if (stringId) {
        const disconnectionPointModel: DisconnectionPointModel = {
          id: Guid.create().toString(),
          projectId: 3,
          stringId: stringId,
          disconnectionPointType: DisconnectionPointType.MC4,
          positiveId: 'undefined',
          negativeId: 'undefined',
          location,
          color: 'black',
          type: TypeModel.DISCONNECTIONPOINT,
        }

        this.dp.add(disconnectionPointModel)
      } else {
        console.error('a string needs to be selected to create a disconnection point')
      }
    })
  }

  createInverterForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then((projectId) => {
      const inverterRequest: InverterModel = {
        id: Guid.create().toString(),
        projectId: projectId,
        location,
        model: TypeModel.INVERTER,
        color: 'blue',
        name: 'New Inverter',
      }

      this.inverters.add(inverterRequest)
    })
  }

  createTrayForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then((projectId) => {
      const trayRequest = new TrayModel(projectId, location, 150)

      this.traysEntity.add(trayRequest)
    })
  }

  createRailForGrid(location: string, doesExist?: BlockModel) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then((projectId) => {
      if (doesExist) {
        firstValueFrom(
          this.panelsEntity.entities$.pipe(
            map((panels) => panels.find((p) => p.id === doesExist.id)),
          ),
        ).then((parentPanel) => {
          if (!parentPanel) {
            return console.error('createRailForGrid !parentPanel')
          }
          const railRequest = new RailModel(projectId, location, true, doesExist.id)

          this.railsEntity.add(railRequest)
          const update: PanelModel = {
            ...parentPanel,
            location,
            rotation: 0,
          }

          this.panelsEntity.update(update)
        })
      } else {
        const railRequest = new RailModel(projectId, location, false)

        this.railsEntity.add(railRequest)
      }
    })
  }
}
