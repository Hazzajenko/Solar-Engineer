import { DisconnectionPointsEntityService } from '../ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { LinksEntityService } from '../ngrx-data/links-entity/links-entity.service'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { UnitModel } from '../../../models/unit.model'
import { JoinsEntityService } from '../ngrx-data/joins-entity/joins-entity.service'
import { Guid } from 'guid-typescript'
import { LinkModel } from '../../../models/link.model'
import { PanelModel } from '../../../models/panel.model'
import { LinksStateActions } from '../store/links/links.actions'
import { LinksState } from '../store/links/links.reducer'
import { DisconnectionPointModel } from '../../../models/disconnection-point.model'
import { combineLatestWith, firstValueFrom } from 'rxjs'
import { selectLinksState } from '../store/links/links.selectors'
import { LoggerService } from '../../../../services/logger.service'
import { selectBlocksByProjectIdRouteParams } from '../store/blocks/blocks.selectors'
import { CablesEntityService } from '../ngrx-data/cables-entity/cables-entity.service'
import { CableModel } from '../../../models/cable.model'
import { ItemsService } from '../items.service'
import { LinksPanelsService } from './links-panels.service'
import { BlocksService } from '../store/blocks/blocks.service'

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private linksEntity: LinksEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private cablesEntity: CablesEntityService,
    private logger: LoggerService,
    private itemsService: ItemsService,
    private linksPanelsService: LinksPanelsService,
    private blocksService: BlocksService

  ) {}

  linkSwitch(location: string) {
    firstValueFrom(
      this.blocksService.getBlockByLocationAsync(location)
        .pipe(combineLatestWith(this.store.select(selectLinksState))),
    ).then(([block, joinsState]) => {
      if (!block) {
        return console.error('joinSwitch, block doesnt exist')
      }
      switch (block.model) {
        case UnitModel.PANEL:
          this.itemsService.getItemByLocation(UnitModel.PANEL, location).then((panel) => {
            // this.addPanelToLink(panel, joinsState)
            this.linksPanelsService.addPanelToLink(panel, joinsState)
          })
          break
        case UnitModel.DISCONNECTIONPOINT:
          this.itemsService
            .getItemByLocation(UnitModel.DISCONNECTIONPOINT, location)
            .then((disconnectionPoint) => {
              this.addDpToLink(disconnectionPoint, joinsState)
            })
          break
        /*        case UnitModel.CABLE:
          firstValueFrom(
            this.cablesEntity.entities$.pipe(
              map((cables) => cables.find((cable) => cable.location === location)),
            ),
          ).then((cable) => {
            if (!cable) {
              return console.error('joinSwitch cable doesnt exist on that location')
            }
            this.addCableToLink(cable, joinsState)
          })
          break*/
        default:
          console.warn('cannot link on this object')
          break
      }
    })
  }

  addPanelToLink(panel: PanelModel, linksState: LinksState) {
    if (!panel) {
      return console.error('addPanelToJoin !panel')
    }
    if (linksState?.typeToLink) {
      switch (linksState.typeToLink) {
        case UnitModel.PANEL:
          if (linksState.panelToLink) {
            this.joinPanelToPanel(panel, linksState.panelToLink)
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
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
        case UnitModel.PANEL:
          if (linksState.panelToLink) {
            this.joinDpToPanel(disconnectionPoint, linksState.panelToLink)
          }
          break
        case UnitModel.CABLE:
          if (linksState.cableToLink) {
            console.info('linksState.cableToLink')
            this.joinDpToCable(disconnectionPoint, linksState.cableToLink)
          }
          break
        case UnitModel.DISCONNECTIONPOINT:
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
        case UnitModel.DISCONNECTIONPOINT:
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
      cable_id: cable.id,
    }

    this.disconnectionPointsEntity.update(update)

    const linkRequest: LinkModel = {
      id: Guid.create().toString(),
      project_id: dpToJoin.project_id,
      string_id: dpToJoin.string_id,
      positive_id: dpToJoin.id,
      positive_model: UnitModel.DISCONNECTIONPOINT,
      negative_id: cable.id,
      negative_model: UnitModel.CABLE,
    }

    this.linksEntity.add(linkRequest)

    this.store.dispatch(LinksStateActions.addToLinkCable({ cable }))
  }

  joinDpToCable(dp?: DisconnectionPointModel, cableToJoin?: CableModel) {
    if (!dp || !cableToJoin) {
      return console.error(`joinDpToCable !dp || !cableToJoin`)
    }
    const linkRequest: LinkModel = {
      id: Guid.create().toString(),
      project_id: cableToJoin.project_id,
      string_id: dp.string_id,
      positive_id: cableToJoin.id,
      positive_model: UnitModel.CABLE,
      negative_id: dp.id,
      negative_model: UnitModel.DISCONNECTIONPOINT,
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
      string_id: panelToJoin.string_id,
      positive_id: panelToJoin.id,
    }

    this.disconnectionPointsEntity.update(update)

    const panelJoinRequest: LinkModel = {
      id: Guid.create().toString(),
      project_id: panelToJoin.project_id,
      string_id: panelToJoin.string_id,
      positive_id: panelToJoin.id,
      positive_model: UnitModel.PANEL,
      negative_id: dp.id,
      negative_model: UnitModel.DISCONNECTIONPOINT,
    }

    this.linksEntity.add(panelJoinRequest)

    this.store.dispatch(LinksStateActions.addToLinkDp({ disconnectionPoint: dp }))
  }

  joinPanelToPanelV2(panel?: PanelModel, panelToLink?: string) {
    if (!panel) {
      return console.error(`joinPanelToPanel panel doesnt exist on location ${location}`)
    }
    if (panelToLink) {
      const panelJoinRequest: LinkModel = {
        id: Guid.create().toString(),
        project_id: panel.project_id,
        string_id: panel.string_id,
        positive_id: panelToLink,
        positive_model: UnitModel.PANEL,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
      }

      this.linksEntity.add(panelJoinRequest)

      const updatePanel: PanelModel = {
        ...panel,
        string_id: panel.string_id,
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
      const panelJoinRequest: LinkModel = {
        id: Guid.create().toString(),
        project_id: panelToJoin.project_id,
        string_id: panelToJoin.string_id,
        positive_id: panelToJoin.id,
        positive_model: UnitModel.PANEL,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
      }

      this.linksEntity.add(panelJoinRequest)

      const updatePanel: PanelModel = {
        ...panel,
        string_id: panelToJoin.string_id,
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
        string_id: panel.string_id,
        negative_id: panel.id,
      }

      this.disconnectionPointsEntity.update(update)

      const panelJoinRequest: LinkModel = {
        id: Guid.create().toString(),
        project_id: panel.project_id,
        string_id: panel.string_id,
        negative_id: panel.id,
        negative_model: UnitModel.PANEL,
        positive_id: dpToJoin.id,
        positive_model: UnitModel.DISCONNECTIONPOINT,
      }

      this.linksEntity.add(panelJoinRequest)
    }

    this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
  }
}
