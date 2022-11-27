import { Injectable } from '@angular/core'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { Guid } from 'guid-typescript'
import { CablesEntityService } from '../../project-id/services/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/inverters-entity/inverters-entity.service'
import { GridService } from './grid.service'
import { JoinsEntityService } from '../../project-id/services/joins-entity/joins-entity.service'
import { JoinModel } from '../../models/join.model'
import { UnitModel } from '../../models/unit.model'
import { CableModel } from '../../models/cable.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { GridStateActions } from '../../store/grid/grid.actions'
import { JoinsService } from '../joins.service'
import { LoggerService } from '../../../services/logger.service'
import { PanelJoinsEntityService } from '../../project-id/services/panel-joins-entity/panel-joins-entity.service'
import { PanelJoinModel } from '../../models/panel-join.model'
import { PanelModel } from '../../models/panel.model'
import { combineLatest } from 'rxjs'
import { selectBlockToJoin } from '../../store/joins/joins.selectors'
import { JoinsStateActions } from '../../store/joins/joins.actions'
import { StringsEntityService } from '../../project-id/services/strings-entity/strings-entity.service'
import { StringModel } from '../../models/string.model'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../project-id/services/disconnection-points-entity/disconnection-points-entity.service'

@Injectable({
  providedIn: 'root',
})
export class GridJoinService extends GridService {
  joinArray: string[] = []

  constructor(
    panelsEntity: PanelsEntityService,
    cablesEntity: CablesEntityService,
    invertersEntity: InvertersEntityService,
    joinsEntity: JoinsEntityService,
    joinsService: JoinsService,
    logger: LoggerService,
    private store: Store<AppState>,
    private panelJoinsEntity: PanelJoinsEntityService,
    private stringsEntity: StringsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
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

  joinSwitch(location: string, project: ProjectModel, blocks?: BlockModel[]) {
    if (!blocks) return console.log('no blocks to join')
    let existingBlockToJoin: BlockModel | undefined
    const blockToJoin = blocks.find((block) => block.location === location)
    if (!blockToJoin) {
      return console.log('no block here')
    }
    this.store.select(selectBlockToJoin).subscribe((block$) => {
      existingBlockToJoin = block$
    })
    console.log('blockToJoin', blockToJoin)

    switch (blockToJoin.model) {
      case UnitModel.PANEL:
        console.log('addPanelToJoin')
        return this.addPanelToJoin(location, project, blocks)

      case UnitModel.CABLE:
        break

      case UnitModel.DISCONNECTIONPOINT:
        this.addDpToJoin(location, project)
        break

      case UnitModel.INVERTER:
        break
      default:
        break
    }
  }

  addToJoinArray(
    location: string,
    joinArray: string[],
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    const existing = blocks.find((block) => block.location === location)
    if (!existing) return console.log('no block to add toJoinArray')
    if (joinArray.length === 0) {
      return this.store.dispatch(
        GridStateActions.addToJoinArray({ toJoin: location }),
      )
    }
    if (joinArray) {
      joinArray.forEach((join) => {
        if (this.isBlockInSurrounding(location, join, blocks)) {
          return this.store.dispatch(
            GridStateActions.addToJoinArray({ toJoin: location }),
          )
        }
      })
    }
  }

  addPanelToJoin(
    panelLocation: string,
    project: ProjectModel,
    blocks: BlockModel[],
  ) {
    let panel: PanelModel | undefined
    let panels: PanelModel[] | undefined
    let blockToJoin: BlockModel | undefined
    let panelToJoin: PanelModel | undefined
    let dpToJoin: DisconnectionPointModel | undefined
    let panelString: StringModel | undefined
    combineLatest([
      this.panelsEntity.entities$,
      this.store.select(selectBlockToJoin),
      this.stringsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).subscribe(([panels$, blockToJoin$, strings$, disconnectionPoints]) => {
      panel = panels$.find((p) => p.location === panelLocation)
      panels = panels$
      panelString = strings$.find((s) => s.id === panel?.string_id)

      if (blockToJoin$) {
        blockToJoin = blockToJoin$
        switch (blockToJoin$?.model) {
          case UnitModel.PANEL:
            panelToJoin = panels$.find(
              (p) => p.location === blockToJoin$.location,
            )
            break
          case UnitModel.DISCONNECTIONPOINT:
            dpToJoin = disconnectionPoints.find(
              (dp) => dp.location === blockToJoin$.location,
            )
            break
        }
      }
    })
    console.log('blockToJoin', blockToJoin)

    if (blockToJoin) {
      switch (blockToJoin?.model) {
        case UnitModel.PANEL:
          this.joinPanelToPanel(project, panel!, panelString!, panelToJoin!)
          break
        case UnitModel.DISCONNECTIONPOINT:
          this.joinPanelToDp(project, panel!, panelString!, dpToJoin!)
          break
      }
    } else {
      if (panel) {
        const block: BlockModel = {
          id: panel.id,
          model: UnitModel.PANEL,
          location: panel.location,
          project_id: project.id,
        }
        this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
      }
    }
  }

  joinPanelToPanel(
    project: ProjectModel,
    panel?: PanelModel,
    panelString?: StringModel,
    panelToJoin?: PanelModel,
  ) {
    if (!panel) return

    if (panelToJoin && panelString) {
      const panelJoinRequest: PanelJoinModel = {
        id: Guid.create().toString(),
        project_id: project.id,
        string_id: panelToJoin.string_id,
        positive_id: panelToJoin.id,
        positive_model: UnitModel.PANEL,
        negative_id: panel!.id,
        negative_model: UnitModel.PANEL,
      }

      this.panelJoinsEntity.add(panelJoinRequest)

      console.log('panelString', panelString)

      const updatePanel: PanelModel = {
        ...panel,
        string_id: panelToJoin.string_id,
        color: panelString.color,
      }
      this.panelsEntity.update(updatePanel)
    }

    const block: BlockModel = {
      id: panel.id,
      model: UnitModel.PANEL,
      location: panel.location,
      project_id: project.id,
    }

    this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
  }

  joinPanelToDp(
    project: ProjectModel,
    panel?: PanelModel,
    panelString?: StringModel,
    dpToJoin?: DisconnectionPointModel,
  ) {
    if (!panel) return

    if (dpToJoin && panelString) {
      const update: Partial<DisconnectionPointModel> = {
        ...dpToJoin,
        string_id: panelString.id,
        negative_id: panel.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelJoinModel = {
        id: Guid.create().toString(),
        project_id: project.id,
        string_id: panel.string_id,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
        positive_id: dpToJoin.id,
        positive_model: UnitModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    const block: BlockModel = {
      id: panel.id,
      model: UnitModel.PANEL,
      location: panel.location,
      project_id: project.id,
    }

    this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
  }

  joinDpToPanel(
    project: ProjectModel,
    panelToJoin?: PanelModel,
    dpString?: StringModel,
    dp?: DisconnectionPointModel,
  ) {
    if (!dp) return

    if (panelToJoin && dpString) {
      const update: Partial<DisconnectionPointModel> = {
        ...dp,
        string_id: panelToJoin.string_id,
        positive_id: panelToJoin.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelJoinModel = {
        id: Guid.create().toString(),
        project_id: project.id,
        string_id: panelToJoin.string_id,
        positive_id: panelToJoin.id,
        positive_model: UnitModel.PANEL,
        negative_id: dp.id,
        negative_model: UnitModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    const block: BlockModel = {
      id: dp.id,
      model: UnitModel.DISCONNECTIONPOINT,
      location: dp.location!,
      project_id: project.id,
    }

    this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
  }

  addDpToJoin(dpLocation: string, project: ProjectModel) {
    let dp: DisconnectionPointModel | undefined
    let blockToJoin: BlockModel | undefined
    let panelToJoin: PanelModel | undefined
    let dpToJoin: DisconnectionPointModel | undefined
    let dpString: StringModel | undefined
    combineLatest([
      this.panelsEntity.entities$,
      this.store.select(selectBlockToJoin),
      this.stringsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).subscribe(([panels$, blockToJoin$, strings$, dps$]) => {
      dp = dps$.find((dp) => dp.location === dpLocation)
      dpString = strings$.find((s) => s.id === dp?.string_id)

      if (blockToJoin$) {
        blockToJoin = blockToJoin$
        switch (blockToJoin$?.model) {
          case UnitModel.PANEL:
            panelToJoin = panels$.find(
              (p) => p.location === blockToJoin$.location,
            )
            break
          case UnitModel.DISCONNECTIONPOINT:
            dpToJoin = dps$.find((dp) => dp.location === blockToJoin$.location)
            break
        }
      }
    })

    if (blockToJoin) {
      switch (blockToJoin?.model) {
        case UnitModel.PANEL:
          this.joinDpToPanel(project, panelToJoin!, dpString!, dp!)
          break
        case UnitModel.DISCONNECTIONPOINT:
          console.log('err cannot join dp to dp')
          break
      }
    } else {
      if (dp) {
        const block: BlockModel = {
          id: dp.id,
          model: UnitModel.DISCONNECTIONPOINT,
          location: dp.location!,
          project_id: project.id,
        }
        this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
      }
    }
  }

  async createJoin(vm: {
    toJoinArray: string[] | null
    blocks: BlockModel[] | null
    project: ProjectModel | undefined | null
    cables: CableModel[] | null
  }) {
    if (!vm.toJoinArray) return
    if (!vm.blocks) return
    if (!vm.project) return
    if (!vm.cables) return

    const joinId = Guid.create().toString()

    const joinRequest: JoinModel = {
      id: joinId,
      project_id: vm.project.id,
      color: 'purple',
      blocks: vm.toJoinArray,
      model: UnitModel.JOIN,
      size: 4,
      type: 'JOIN',
    }

    await this.joinsEntity.add(joinRequest)

    let getCables: CableModel[] = []
    const subscription = this.cablesEntity.entities$.subscribe((cables) => {
      console.log(cables)
      return (getCables = cables)
    })
    console.log(getCables)
    const cablesToJoin = getCables.filter(
      (cable) =>
        vm.toJoinArray!.includes(cable.location) &&
        cable.model === UnitModel.CABLE,
    )
    cablesToJoin.forEach((join) => {
      const update: CableModel = {
        ...join,
        join_id: joinId,
      }
      console.log(update)
      return this.cablesEntity.update(update)
    })
    console.log(cablesToJoin)
    return subscription.unsubscribe()
  }

  async createJoinWithBlocks(vm: {
    toJoinArray: string[] | null
    blocks: BlockModel[] | null
    project: ProjectModel | undefined | null
    cables: CableModel[] | null
  }) {
    if (!vm.toJoinArray) return
    if (!vm.blocks) return
    if (!vm.project) return
    if (!vm.cables) return

    const joinId = Guid.create().toString()

    const joinRequest: JoinModel = {
      id: joinId,
      project_id: vm.project.id,
      color: 'purple',
      blocks: vm.toJoinArray,
      model: UnitModel.JOIN,
      size: 4,
      type: 'JOIN',
    }

    await this.joinsEntity.add(joinRequest)

    let getCables: CableModel[] = []
    const subscription = this.cablesEntity.entities$.subscribe((cables) => {
      console.log(cables)
      return (getCables = cables)
    })
    console.log(getCables)
    const cablesToJoin = getCables.filter(
      (cable) =>
        vm.toJoinArray!.includes(cable.location) &&
        cable.model === UnitModel.CABLE,
    )
    cablesToJoin.forEach((join) => {
      const update: CableModel = {
        ...join,
        join_id: joinId,
      }
      console.log(update)
      return this.cablesEntity.update(update)
    })
    console.log(cablesToJoin)
    return subscription.unsubscribe()
  }

  private isBlockInSurrounding(
    location: string,
    existing: string,
    blocks: BlockModel[],
  ): boolean {
    if (!location || !blocks) {
      return false
    }

    let numberRow: number = 0
    let numberCol: number = 0

    // const location = cable.location
    const split = location.split('')
    split.forEach((p, index) => {
      if (p === 'c') {
        const row = location.slice(3, index)
        const col = location.slice(index + 3, location.length)
        numberRow = Number(row)
        numberCol = Number(col)
      }
    })
    const topString: string = `row${numberRow - 1}col${numberCol}`
    const bottomString: string = `row${numberRow + 1}col${numberCol}`
    const leftString: string = `row${numberRow}col${numberCol - 1}`
    const rightString: string = `row${numberRow}col${numberCol + 1}`

    const findTop = blocks.find(
      (block) => block.location === topString && block.location === existing,
    )
    const findBottom = blocks.find(
      (block) => block.location === bottomString && block.location === existing,
    )
    const findLeft = blocks.find(
      (block) => block.location === leftString && block.location === existing,
    )
    const findRight = blocks.find(
      (block) => block.location === rightString && block.location === existing,
    )

    if (findTop) console.log('FIND TOP', findTop.location)
    if (findBottom) console.log('FIND BOTTOM', findBottom.location)
    if (findLeft) console.log('FIND LEFT', findLeft.location)
    if (findRight) console.log('FIND RIGHT', findRight.location)

    if (findTop) return true
    if (findBottom) return true
    if (findLeft) return true
    return !!findRight
  }
}
