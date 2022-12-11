import { LinksState } from '../../project-id/services/store/links/links.reducer'
import { Injectable } from '@angular/core'
import { ProjectModel } from '../../models/project.model'
import { BlockModel } from '../../models/block.model'
import { PanelsEntityService } from '../../project-id/services/ngrx-data/panels-entity/panels-entity.service'
import { Guid } from 'guid-typescript'
import { CablesEntityService } from '../../project-id/services/ngrx-data/cables-entity/cables-entity.service'
import { InvertersEntityService } from '../../project-id/services/ngrx-data/inverters-entity/inverters-entity.service'
import { GridService } from './grid.service'
import { JoinsEntityService } from '../../project-id/services/ngrx-data/joins-entity/joins-entity.service'
import { TypeModel } from '../../models/type.model'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { LinksService } from '../../project-id/services/links/links.service'
import { LoggerService } from '../../../services/logger.service'
import { PanelLinksEntityService } from '../../project-id/services/ngrx-data/panel-links-entity/panel-links-entity.service'
import { PanelLinkModel } from '../../models/panel-link.model'
import { PanelModel } from '../../models/panel.model'
import { combineLatest } from 'rxjs'
import { LinksStateActions } from '../../project-id/services/store/links/links.actions'
import { StringsEntityService } from '../../project-id/services/ngrx-data/strings-entity/strings-entity.service'
import { StringModel } from '../../models/string.model'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { DisconnectionPointsEntityService } from '../../project-id/services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'

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
    joinsService: LinksService,
    logger: LoggerService,
    private store: Store<AppState>,
    private panelJoinsEntity: PanelLinksEntityService,
    private stringsEntity: StringsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
  ) {
    super(panelsEntity, cablesEntity, invertersEntity, joinsEntity, joinsService, logger)
  }

  joinSwitch(location: string, project: ProjectModel, blocks?: BlockModel[]) {
    if (!blocks) return console.log('no blocks to join')
    let existingBlockToJoin: BlockModel | undefined
    const blockToJoin = blocks.find((block) => block.location === location)
    if (!blockToJoin) {
      return console.log('no block here')
    }
    // this.store.select(selectBlockToJoin).subscribe((block$) => {
    //   existingBlockToJoin = block$
    // })
    console.log('blockToJoin', blockToJoin)

    switch (blockToJoin.type) {
      case TypeModel.PANEL:
        console.log('addPanelToJoin')
        // return this.addPanelToJoin(location, project, blocks)
        // return this.addPanelToJoinV2(location, project, blocks)
        break

      case TypeModel.CABLE:
        break

      case TypeModel.DISCONNECTIONPOINT:
        this.addDpToJoin(location, project)
        break

      case TypeModel.INVERTER:
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
    console.log('deleted addToJoinArray')
    // const existing = blocks.find((block) => block.location === location)
    // if (!existing) return console.log('no block to add toJoinArray')
    // if (joinArray.length === 0) {
    //   // return this.store.dispatch(
    //   //   GridStateActions.addToJoinArray({ toJoin: location }),
    //   // )
    //   return this.store.dispatch(
    //     SelectedStateActions.addToJoin({ block: existing }),
    //   )
    // }
    // if (joinArray) {
    //   joinArray.forEach((join) => {
    //     if (this.isBlockInSurrounding(location, join, blocks)) {
    //       // return this.store.dispatch(
    //       //   GridStateActions.addToJoinArray({ toJoin: location }),
    //       // )
    //       return this.store.dispatch(
    //         SelectedStateActions.addToJoin({ block: existing }),
    //       )
    //     }
    //   })
    // }
  }

  addPanelToJoin(panelLocation: string, project: ProjectModel, blocks: BlockModel[]) {
    /*    let panel: PanelModel | undefined
        let panels: PanelModel[] | undefined
        let blockToJoin: BlockModel | undefined
        let panelToJoin: PanelModel | undefined
        let dpToJoin: DisconnectionPointModel | undefined
        let panelString: StringModel | undefined
        combineLatest([
          this.panelsEntity.entities$,
          this.stringsEntity.entities$,
          this.disconnectionPointsEntity.entities$,
        ]).subscribe(([panels$, strings$, disconnectionPoints]) => {
          panel = panels$.find((p) => p.location === panelLocation)
          panels = panels$
          panelString = strings$.find((s) => s.id === panel?.string_id)

          // if (blockToJoin$) {
          //   blockToJoin = blockToJoin$
          //   switch (blockToJoin$?.model) {
          //     case UnitModel.PANEL:
          //       panelToJoin = panels$.find(
          //         (p) => p.location === blockToJoin$.location,
          //       )
          //       break
          //     case UnitModel.DISCONNECTIONPOINT:
          //       dpToJoin = disconnectionPoints.find(
          //         (dp) => dp.location === blockToJoin$.location,
          //       )
          //       break
          //   }
          // }
        })*/
    // console.log('blockToJoin', blockToJoin)
    /*
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
            // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
          }
        }*/
  }

  addPanelToJoinV2(project: ProjectModel, panel: PanelModel, joinsState?: LinksState) {
    /*if (joinsState?.typeToLink) {
      switch (joinsState.typeToLink) {
        case UnitModel.PANEL:
          if (joinsState.panelToLink) {
            this.joinPanelToPanelV2(project, panel, joinsState.panelToLink)
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
          if (joinsState.dpToLink) {
            this.joinPanelToDpV2(project, panel, joinsState.dpToLink)
          }
          break
      }
    } else {
      if (panel) {
        this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
      }
    }*/
  }

  joinPanelToPanelV2(project: ProjectModel, panel?: PanelModel, panelToJoin?: PanelModel) {
    /*    if (!panel) return

        if (panelToJoin && panel) {
          const panelJoinRequest: LinkModel = {
            id: Guid.create().toString(),
            project_id: project.id,
            string_id: panelToJoin.string_id,
            positive_id: panelToJoin.id,
            positive_model: UnitModel.PANEL,
            negative_id: panel.id,
            negative_model: UnitModel.PANEL,
          }

          this.panelJoinsEntity.add(panelJoinRequest)

          const updatePanel: PanelModel = {
            ...panel,
            string_id: panelToJoin.string_id,
            color: panel.color,
          }
          this.panelsEntity.update(updatePanel)
        }

        this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))*/
  }

  joinPanelToPanel(
    project: ProjectModel,
    panel?: PanelModel,
    panelString?: StringModel,
    panelToJoin?: PanelModel,
  ) {
    if (!panel) return

    if (panelToJoin && panelString) {
      const panelJoinRequest: PanelLinkModel = {
        id: Guid.create().toString(),
        projectId: project.id,
        stringId: panelToJoin.stringId,
        positiveToId: panelToJoin.id,
        positiveModel: TypeModel.PANEL,
        negativeToId: panel!.id,
        negativeModel: TypeModel.PANEL,
      }

      this.panelJoinsEntity.add(panelJoinRequest)

      console.log('panelString', panelString)

      const updatePanel: PanelModel = {
        ...panel,
        stringId: panelToJoin.stringId,
        color: panelString.color,
      }
      this.panelsEntity.update(updatePanel)
    }

    const block: BlockModel = {
      id: panel.id,
      type: TypeModel.PANEL,
      location: panel.location,
      projectId: project.id,
    }

    // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
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
        stringId: panelString.id,
        negativeId: panel.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelLinkModel = {
        id: Guid.create().toString(),
        projectId: project.id,
        stringId: panel.stringId,
        negativeToId: panel.id,
        negativeModel: TypeModel.PANEL,
        positiveToId: dpToJoin.id,
        positiveModel: TypeModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    const block: BlockModel = {
      id: panel.id,
      type: TypeModel.PANEL,
      location: panel.location,
      projectId: project.id,
    }

    // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
  }

  joinPanelToDpV2(project: ProjectModel, panel?: PanelModel, dpToJoin?: DisconnectionPointModel) {
    /*    if (!panel) return

        if (dpToJoin && panel) {
          const update: Partial<DisconnectionPointModel> = {
            ...dpToJoin,
            string_id: panel.string_id,
            negative_id: panel.id,
          }

          this.disconnectionPointsEntity.update(update)

          const panelJoinRequest: LinkModel = {
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

        this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))*/
  }

  joinDpToPanelV2(project: ProjectModel, dp?: DisconnectionPointModel, panelToJoin?: PanelModel) {
    if (!dp) return

    if (panelToJoin && panelToJoin) {
      const update: Partial<DisconnectionPointModel> = {
        ...dp,
        stringId: panelToJoin.stringId,
        positiveId: panelToJoin.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelLinkModel = {
        id: Guid.create().toString(),
        projectId: project.id,
        stringId: panelToJoin.stringId,
        positiveToId: panelToJoin.id,
        positiveModel: TypeModel.PANEL,
        negativeToId: dp.id,
        negativeModel: TypeModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    this.store.dispatch(LinksStateActions.addToLinkDp({ disconnectionPoint: dp }))
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
        stringId: panelToJoin.stringId,
        positiveId: panelToJoin.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelLinkModel = {
        id: Guid.create().toString(),
        projectId: project.id,
        stringId: panelToJoin.stringId,
        positiveToId: panelToJoin.id,
        positiveModel: TypeModel.PANEL,
        negativeToId: dp.id,
        negativeModel: TypeModel.DISCONNECTIONPOINT,
      }

      this.panelJoinsEntity.add(panelJoinRequest)
    }

    const block: BlockModel = {
      id: dp.id,
      type: TypeModel.DISCONNECTIONPOINT,
      location: dp.location!,
      projectId: project.id,
    }

    // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
  }

  addDpToJoin(dpLocation: string, project: ProjectModel) {
    let dp: DisconnectionPointModel | undefined
    let blockToJoin: BlockModel | undefined
    let panelToJoin: PanelModel | undefined
    let dpToJoin: DisconnectionPointModel | undefined
    let dpString: StringModel | undefined
    combineLatest([
      this.panelsEntity.entities$,
      this.stringsEntity.entities$,
      this.disconnectionPointsEntity.entities$,
    ]).subscribe(([panels$, strings$, dps$]) => {
      dp = dps$.find((dp) => dp.location === dpLocation)
      dpString = strings$.find((s) => s.id === dp?.stringId)

      //   if (blockToJoin$) {
      //     blockToJoin = blockToJoin$
      //     switch (blockToJoin$?.model) {
      //       case UnitModel.PANEL:
      //         panelToJoin = panels$.find(
      //           (p) => p.location === blockToJoin$.location,
      //         )
      //         break
      //       case UnitModel.DISCONNECTIONPOINT:
      //         dpToJoin = dps$.find((dp) => dp.location === blockToJoin$.location)
      //         break
      //     }
      //   }
      // })

      if (blockToJoin) {
        switch (blockToJoin?.type) {
          case TypeModel.PANEL:
            this.joinDpToPanel(project, panelToJoin!, dpString!, dp!)
            break
          case TypeModel.DISCONNECTIONPOINT:
            console.log('err cannot join dp to dp')
            break
        }
      } else {
        if (dp) {
          const block: BlockModel = {
            id: dp.id,
            type: TypeModel.DISCONNECTIONPOINT,
            location: dp.location!,
            projectId: project.id,
          }
          // this.store.dispatch(JoinsStateActions.addToBlockJoin({ block }))
        }
      }
    })
  }
}

//   async createJoin(vm: {
//     toJoinArray: string[] | null
//     blocks: BlockModel[] | null
//     project: ProjectModel | undefined | null
//     cables: CableModel[] | null
//   }) {
//     if (!vm.toJoinArray) return
//     if (!vm.blocks) return
//     if (!vm.project) return
//     if (!vm.cables) return

//     const joinId = Guid.create().toString()

//     const joinRequest: JoinModel = {
//       id: joinId,
//       project_id: vm.project.id,
//       color: 'purple',
//       blocks: vm.toJoinArray,
//       model: UnitModel.JOIN,
//       size: 4,
//       type: 'JOIN',
//     }

//     await this.joinsEntity.add(joinRequest)

//     let getCables: CableModel[] = []
//     const subscription = this.cablesEntity.entities$.subscribe((cables) => {
//       console.log(cables)
//       return (getCables = cables)
//     })
//     console.log(getCables)
//     const cablesToJoin = getCables.filter(
//       (cable) =>
//         vm.toJoinArray!.includes(cable.location) &&
//         cable.model === UnitModel.CABLE,
//     )
//     cablesToJoin.forEach((join) => {
//       const update: CableModel = {
//         ...join,
//         join_id: joinId,
//       }
//       console.log(update)
//       return this.cablesEntity.update(update)
//     })
//     console.log(cablesToJoin)
//     return subscription.unsubscribe()
//   }

//   async createJoinWithBlocks(vm: {
//     toJoinArray: string[] | null
//     blocks: BlockModel[] | null
//     project: ProjectModel | undefined | null
//     cables: CableModel[] | null
//   }) {
//     if (!vm.toJoinArray) return
//     if (!vm.blocks) return
//     if (!vm.project) return
//     if (!vm.cables) return

//     const joinId = Guid.create().toString()

//     const joinRequest: JoinModel = {
//       id: joinId,
//       project_id: vm.project.id,
//       color: 'purple',
//       blocks: vm.toJoinArray,
//       model: UnitModel.JOIN,
//       size: 4,
//       type: 'JOIN',
//     }

//     await this.joinsEntity.add(joinRequest)

//     let getCables: CableModel[] = []
//     const subscription = this.cablesEntity.entities$.subscribe((cables) => {
//       console.log(cables)
//       return (getCables = cables)
//     })
//     console.log(getCables)
//     const cablesToJoin = getCables.filter(
//       (cable) =>
//         vm.toJoinArray!.includes(cable.location) &&
//         cable.model === UnitModel.CABLE,
//     )
//     cablesToJoin.forEach((join) => {
//       const update: CableModel = {
//         ...join,
//         join_id: joinId,
//       }
//       console.log(update)
//       return this.cablesEntity.update(update)
//     })
//     console.log(cablesToJoin)
//     return subscription.unsubscribe()
//   }

//   private isBlockInSurrounding(
//     location: string,
//     existing: string,
//     blocks: BlockModel[],
//   ): boolean {
//     if (!location || !blocks) {
//       return false
//     }

//     let numberRow: number = 0
//     let numberCol: number = 0

//     // const location = cable.location
//     const split = location.split('')
//     split.forEach((p, index) => {
//       if (p === 'c') {
//         const row = location.slice(3, index)
//         const col = location.slice(index + 3, location.length)
//         numberRow = Number(row)
//         numberCol = Number(col)
//       }
//     })
//     const topString: string = `row${numberRow - 1}col${numberCol}`
//     const bottomString: string = `row${numberRow + 1}col${numberCol}`
//     const leftString: string = `row${numberRow}col${numberCol - 1}`
//     const rightString: string = `row${numberRow}col${numberCol + 1}`

//     const findTop = blocks.find(
//       (block) => block.location === topString && block.location === existing,
//     )
//     const findBottom = blocks.find(
//       (block) => block.location === bottomString && block.location === existing,
//     )
//     const findLeft = blocks.find(
//       (block) => block.location === leftString && block.location === existing,
//     )
//     const findRight = blocks.find(
//       (block) => block.location === rightString && block.location === existing,
//     )

//     if (findTop) console.log('FIND TOP', findTop.location)
//     if (findBottom) console.log('FIND BOTTOM', findBottom.location)
//     if (findLeft) console.log('FIND LEFT', findLeft.location)
//     if (findRight) console.log('FIND RIGHT', findRight.location)

//     if (findTop) return true
//     if (findBottom) return true
//     if (findLeft) return true
//     return !!findRight
//   }
// }
