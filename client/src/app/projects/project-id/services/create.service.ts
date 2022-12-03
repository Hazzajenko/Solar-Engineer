import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { combineLatestWith, firstValueFrom, lastValueFrom } from 'rxjs'
import { StringModel } from '../../models/string.model'
import { PanelModel } from '../../models/panel.model'
import { InverterModel } from '../../models/inverter.model'
import { UnitModel } from '../../models/unit.model'
import { selectBlocksByProjectIdRouteParams } from './store/blocks/blocks.selectors'
import { selectCreateMode } from './store/grid/grid.selectors'
import { Guid } from 'guid-typescript'
import { PanelsEntityService } from './ngrx-data/panels-entity/panels-entity.service'
import { CableModel } from '../../models/cable.model'
import {
  DisconnectionPointModel,
  DisconnectionPointType,
} from '../../models/disconnection-point.model'
import { StringsEntityService } from './ngrx-data/strings-entity/strings-entity.service'
import { selectCurrentProjectId } from './store/projects/projects.selectors'
import { CablesEntityService } from './ngrx-data/cables-entity/cables-entity.service'
import { JoinModel } from '../../models/join.model'
import { JoinsEntityService } from './ngrx-data/joins-entity/joins-entity.service'
import { getSurroundings } from './helper-functions'
import { UpdateService } from './update.service'
import { DisconnectionPointsEntityService } from './ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { InvertersEntityService } from './ngrx-data/inverters-entity/inverters-entity.service'
import { TrayModel } from '../../models/tray.model'
import { TraysEntityService } from './ngrx-data/trays-entity/trays-entity.service'
import { selectSelectedId } from './store/selected/selected.selectors'
import { RailModel } from '../../models/rail.model'
import { RailsEntityService } from './ngrx-data/rails-entity/rails-entity.service'
import { BlocksEntityService } from './ngrx-data/blocks-entity/blocks-entity.service'
import { BlockModel } from '../../models/block.model'

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
  ) {}

  createSwitch(location: string) {
    firstValueFrom(
      this.store
        .select(selectBlocksByProjectIdRouteParams)
        .pipe(combineLatestWith(this.store.select(selectCreateMode))),
    ).then(([blocks, createMode]) => {
      const doesExist = blocks.find((block) => block.location === location)
      if (doesExist && createMode !== UnitModel.RAIL) {
        return console.log('cell location taken')
      }

      switch (createMode) {
        case UnitModel.PANEL:
          return this.createPanelForGrid(location)

        case UnitModel.CABLE:
          return this.createCableForGrid(location)

        case UnitModel.DISCONNECTIONPOINT:
          return this.createDisconnectionPointForGrid(location)

        case UnitModel.INVERTER:
          return this.createInverterForGrid(location)

        case UnitModel.TRAY:
          return this.createTrayForGrid(location)
        case UnitModel.RAIL:
          return this.createRailForGrid(location, doesExist)
        default:
          break
      }
    })
  }

  createPanelForGrid(location: string) {
    firstValueFrom(this.store.select(selectSelectedId)).then(
      (selectedStringId) => {
        if (!selectedStringId) {
          const panelRequest: PanelModel = {
            id: Guid.create().toString(),
            string_id: 'undefined',
            location,
          }

          this.panelsEntity.add(panelRequest)
        } else {
          const panelRequest: PanelModel = {
            id: Guid.create().toString(),
            string_id: selectedStringId,
            location,
          }

          this.panelsEntity.add(panelRequest)
        }
      },
    )
  }

  createCableForGrid(location: string) {
    firstValueFrom(
      this.cablesEntity.entities$.pipe(
        combineLatestWith(this.store.select(selectCurrentProjectId)),
      ),
    ).then(([cables, projectId]) => {
      const surroundingCables = getSurroundings(location, cables)

      if (!surroundingCables)
        return console.log('joinNearbyCables surroundingCables err')

      const newJoinId = Guid.create().toString()

      const joinRequest: JoinModel = {
        id: newJoinId,
        project_id: projectId,
        color: 'purple',
        model: UnitModel.JOIN,
        size: 4,
        type: 'JOIN',
      }
      /*      return new Promise<JoinModel>((resolve, reject) =>
              this.joinsEntity.add(joinRequest)*/
      lastValueFrom(this.joinsEntity.add(joinRequest)).then(() => {
        if (surroundingCables.topCable) {
          this.update.updateCableForJoin(
            surroundingCables.topCable,
            newJoinId,
            cables,
          )
        }

        if (surroundingCables.bottomCable) {
          this.update.updateCableForJoin(
            surroundingCables.bottomCable,
            newJoinId,
            cables,
          )
        }

        if (surroundingCables.leftCable) {
          this.update.updateCableForJoin(
            surroundingCables.leftCable,
            newJoinId,
            cables,
          )
        }

        if (surroundingCables.rightCable) {
          this.update.updateCableForJoin(
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
    })
  }

  createDisconnectionPointForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then(
      (projectId) => {
        const stringRequest: StringModel = {
          id: Guid.create().toString(),
          name: 'string',
          is_in_parallel: false,
          project_id: projectId,
          color: 'black',
          model: UnitModel.STRING,
        }

        lastValueFrom(this.stringsEntity.add(stringRequest)).then((res) => {
          const disconnectionPointModel: DisconnectionPointModel = {
            id: Guid.create().toString(),
            project_id: projectId,
            string_id: res.id,
            disconnection_type: DisconnectionPointType.MC4,
            positive_id: 'undefined',
            negative_id: 'undefined',
            location,
            color: 'black',
            model: UnitModel.DISCONNECTIONPOINT,
          }

          this.dp.add(disconnectionPointModel)
        })
      },
    )
  }

  createInverterForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then(
      (projectId) => {
        const inverterRequest: InverterModel = {
          id: Guid.create().toString(),
          project_id: projectId,
          location,
          model: UnitModel.INVERTER,
          color: 'blue',
          name: 'New Inverter',
        }

        this.inverters.add(inverterRequest)
      },
    )
  }

  createTrayForGrid(location: string) {
    firstValueFrom(this.store.select(selectCurrentProjectId)).then(
      (projectId) => {
        const trayRequest = new TrayModel(projectId, location, 150)

        this.traysEntity.add(trayRequest)
      },
    )
  }

  createRailForGrid(location: string, doesExist?: BlockModel) {
    if (doesExist) {
      const railRequest = new RailModel(location, true, doesExist.id)

      this.railsEntity.add(railRequest)
    } else {
      const railRequest = new RailModel(location, false)

      this.railsEntity.add(railRequest)
    }
  }
}
