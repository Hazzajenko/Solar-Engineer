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

@Injectable({
  providedIn: 'root',
})
export class LinksPanelsService {
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
  ) {}

  addPanelToLink(panel: PanelModel, linksState: LinksState) {
    if (!panel) {
      return console.error('addPanelToJoin !panel')
    }
    if (panel.string_id === 'undefined') {
      return console.error('panel needs to be apart of a string')
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

  joinPanelToPanel(panel?: PanelModel, panelToJoin?: PanelModel) {
    if (!panel) {
      return console.error(`joinPanelToPanel panel doesnt exist on location ${location}`)
    }

    if (panelToJoin) {
      if (panel.string_id !== panelToJoin.string_id) {
        return console.error(`both panels need to be on the same string to link`)
      }
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
/*      const updatePanelToJoin: PanelModel = {
        ...panelToJoin,
        // string_id: panelToJoin.string_id,
        // negative_to_id: panelToJoin.negative_to_id,
        positive_to_id: panel.id
      }
      this.panelsEntity.update(updatePanelToJoin)
      const updatePanel: PanelModel = {
        ...panel,
        // string_id: panelToJoin.string_id,
        // positive_to_id: panel.positive_to_id,
        negative_to_id: panelToJoin.id
      }
      this.panelsEntity.update(updatePanel)*/
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
