import { DisconnectionPointsEntityService } from '../ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { PanelLinksEntityService } from '../ngrx-data/panel-links-entity/panel-links-entity.service'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { TypeModel } from '../../../models/type.model'
import { JoinsEntityService } from '../ngrx-data/joins-entity/joins-entity.service'
import { Guid } from 'guid-typescript'
import { PanelLinkModel } from '../../../models/panel-link.model'
import { PanelModel } from '../../../models/panel.model'
import { LinksStateActions } from '../store/links/links.actions'
import { LinksState } from '../store/links/links.reducer'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { selectLinksState } from '../store/links/links.selectors'
import { LoggerService } from '../../../../services/logger.service'
import { CablesEntityService } from '../ngrx-data/cables-entity/cables-entity.service'
import { CableModel } from '../../../models/deprecated-for-now/cable.model'
import { ItemsService } from '../items.service'
import { LinksPanelsService } from './links-panels.service'
import { BlocksService } from '../store/blocks/blocks.service'
import { selectSelectedStringModel } from '../store/selected/selected.selectors'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private linksEntity: PanelLinksEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private cablesEntity: CablesEntityService,
    private logger: LoggerService,
    private itemsService: ItemsService,
    private linksPanelsService: LinksPanelsService,
    private blocksService: BlocksService,
  ) {}

  linkSwitch(location: string, shiftKey: boolean) {
    firstValueFrom(this.store.select(selectSelectedStringModel)).then((selectedState) => {
      if (selectedState.type !== TypeModel.STRING) {
        return console.error('no string selected')
      }
      if (!selectedState.selectedStringId) {
        return console.error('no string selected')
      }
      firstValueFrom(
        this.blocksService
          .getBlockByLocationAsync(location)
          .pipe(combineLatestWith(this.store.select(selectLinksState))),
      ).then(([block, joinsState]) => {
        if (!block) {
          return console.error('joinSwitch, block doesnt exist')
        }
        switch (block.type) {
          case TypeModel.PANEL:
            this.itemsService.getItemByLocation(TypeModel.PANEL, location).then((panel) => {
              this.linksPanelsService.addPanelToLink(
                panel,
                joinsState,
                selectedState.selectedStringId,
                shiftKey,
              )
            })
            break
          case TypeModel.DISCONNECTIONPOINT:
            this.itemsService
              .getItemByLocation(TypeModel.DISCONNECTIONPOINT, location)
              .then((disconnectionPoint) => {
                this.addDpToLink(disconnectionPoint, joinsState)
              })
            break
          default:
            console.warn('cannot link on this object')
            break
        }
      })
    })
  }

  addPanelToLink(panel: PanelModel, linksState: LinksState) {
    if (!panel) {
      return console.error('addPanelToJoin !panel')
    }
    if (linksState?.typeToLink) {
      switch (linksState.typeToLink) {
        case TypeModel.PANEL:
          if (linksState.panelToLink) {
            this.joinPanelToPanel(panel, linksState.panelToLink)
          }
          break
        case TypeModel.DISCONNECTIONPOINT:
          if (linksState.dpToLink) {
            this.joinPanelToDp(panel, linksState.dpToLink)
          }
          break
      }
    } else {
      this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
    }
  }

  addDpToLink(disconnectionPoint: DisconnectionPointModel, linksState: LinksState) {
    if (linksState.typeToLink) {
      switch (linksState.typeToLink) {
        case TypeModel.PANEL:
          if (linksState.panelToLink) {
            this.joinDpToPanel(disconnectionPoint, linksState.panelToLink)
          }
          break
        case TypeModel.CABLE:
          if (linksState.cableToLink) {
            console.info('linksState.cableToLink')
            this.joinDpToCable(disconnectionPoint, linksState.cableToLink)
          }
          break
        case TypeModel.DISCONNECTIONPOINT:
          // this.logger.error('err cannot join dp to dp')
          console.error('err cannot join dp to dp')
          console.error('err cannot join dp to dp2')
          break
      }
    } else {
      console.info('err cannot join dp to dp222')
      this.store.dispatch(LinksStateActions.addToLinkDp({ disconnectionPoint }))
    }
  }

  addCableToLink(cable: CableModel, linksState: LinksState) {
    if (linksState.typeToLink) {
      switch (linksState.typeToLink) {
        case TypeModel.DISCONNECTIONPOINT:
          if (linksState.dpToLink) {
            this.joinCableToDp(cable, linksState.dpToLink)
          }
          break
        default:
          console.error('addCableToLink object not supported')
      }
    } else {
      this.store.dispatch(LinksStateActions.addToLinkCable({ cable }))
    }
  }

  joinCableToDp(cable?: CableModel, dpToJoin?: DisconnectionPointModel) {
    if (!cable || !dpToJoin) {
      return console.error(`joinCableToDp !cable || !dpToJoin`)
    }

    const update: Partial<DisconnectionPointModel> = {
      ...dpToJoin,
      cableId: cable.id,
    }

    this.disconnectionPointsEntity.update(update)

    const linkRequest: PanelLinkModel = {
      isDisconnectionPoint: false,
      id: Guid.create().toString(),
      projectId: dpToJoin.projectId,
      stringId: dpToJoin.stringId,
      positiveToId: dpToJoin.id,
      positiveModel: TypeModel.DISCONNECTIONPOINT,
      negativeToId: cable.id,
      negativeModel: TypeModel.CABLE,
    }

    this.linksEntity.add(linkRequest)

    this.store.dispatch(LinksStateActions.addToLinkCable({ cable }))
  }

  joinDpToCable(dp?: DisconnectionPointModel, cableToJoin?: CableModel) {
    if (!dp || !cableToJoin) {
      return console.error(`joinDpToCable !dp || !cableToJoin`)
    }
    const linkRequest: PanelLinkModel = {
      isDisconnectionPoint: false,
      id: Guid.create().toString(),
      projectId: cableToJoin.project_id,
      stringId: dp.stringId,
      positiveToId: cableToJoin.id,
      positiveModel: TypeModel.CABLE,
      negativeToId: dp.id,
      negativeModel: TypeModel.DISCONNECTIONPOINT,
    }

    this.linksEntity.add(linkRequest)

    this.store.dispatch(LinksStateActions.addToLinkDp({ disconnectionPoint: dp }))
  }

  joinDpToPanel(dp?: DisconnectionPointModel, panelToJoin?: PanelModel) {
    if (!dp || !panelToJoin) {
      return console.error(`joinDpToPanel !dp || !panelToJoin`)
    }
    const update: Partial<DisconnectionPointModel> = {
      ...dp,
      stringId: panelToJoin.stringId,
      positiveId: panelToJoin.id,
    }

    this.disconnectionPointsEntity.update(update)

    const panelJoinRequest: PanelLinkModel = {
      isDisconnectionPoint: false,
      id: Guid.create().toString(),
      projectId: panelToJoin.projectId,
      stringId: panelToJoin.stringId,
      positiveToId: panelToJoin.id,
      positiveModel: TypeModel.PANEL,
      negativeToId: dp.id,
      negativeModel: TypeModel.DISCONNECTIONPOINT,
    }

    this.linksEntity.add(panelJoinRequest)

    this.store.dispatch(LinksStateActions.addToLinkDp({ disconnectionPoint: dp }))
  }

  joinPanelToPanelV2(panel?: PanelModel, panelToLink?: string) {
    if (!panel) {
      return console.error(`joinPanelToPanel panel doesnt exist on location ${location}`)
    }
    if (panelToLink) {
      const panelJoinRequest: PanelLinkModel = {
        isDisconnectionPoint: false,
        id: Guid.create().toString(),
        projectId: panel.projectId,
        stringId: panel.stringId,
        positiveToId: panelToLink,
        positiveModel: TypeModel.PANEL,
        negativeToId: panel.id,
        negativeModel: TypeModel.PANEL,
      }

      this.linksEntity.add(panelJoinRequest)

      const updatePanel: PanelModel = {
        ...panel,
        stringId: panel.stringId,
      }
      this.panelsEntity.update(updatePanel)
      this.store.dispatch(LinksStateActions.finishLinkPanel({ panelId: panel.id }))
    } else {
      this.store.dispatch(LinksStateActions.startLinkPanel({ panelId: panel.id }))
    }

    // this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
  }

  joinPanelToPanel(panel?: PanelModel, panelToJoin?: PanelModel) {
    if (!panel) {
      return console.error(`joinPanelToPanel panel doesnt exist on location ${location}`)
    }
    if (panelToJoin) {
      console.log('panelToJoin', panelToJoin)
      const panelJoinRequest: PanelLinkModel = {
        isDisconnectionPoint: false,
        id: Guid.create().toString(),
        projectId: panelToJoin.projectId,
        stringId: panelToJoin.stringId,
        positiveToId: panelToJoin.id,
        positiveModel: TypeModel.PANEL,
        negativeToId: panel.id,
        negativeModel: TypeModel.PANEL,
      }

      this.linksEntity.add(panelJoinRequest)

      const updatePanel: PanelModel = {
        ...panel,
        stringId: panelToJoin.stringId,
      }
      this.panelsEntity.update(updatePanel)
    }

    this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
  }

  joinPanelToDp(panel?: PanelModel, dpToJoin?: DisconnectionPointModel) {
    if (!panel) {
      return console.error(`joinPanelToDp panel doesnt exist on location ${location}`)
    }

    if (dpToJoin && panel) {
      const update: Partial<DisconnectionPointModel> = {
        ...dpToJoin,
        stringId: panel.stringId,
        negativeId: panel.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: PanelLinkModel = {
        isDisconnectionPoint: false,
        id: Guid.create().toString(),
        projectId: panel.projectId,
        stringId: panel.stringId,
        negativeToId: panel.id,
        negativeModel: TypeModel.PANEL,
        positiveToId: dpToJoin.id,
        positiveModel: TypeModel.DISCONNECTIONPOINT,
      }

      this.linksEntity.add(panelJoinRequest)
    }

    this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
  }
}
