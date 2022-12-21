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
import { LoggerService } from '../../../../services/logger.service'
import { CablesEntityService } from '../ngrx-data/cables-entity/cables-entity.service'
import { ItemsService } from '../items.service'
import { LinksPathService } from './links-path.service'
import { SelectedStateActions } from '../store/selected/selected.actions'
import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import { MultiActions } from '../store/multi-create/multi.actions'
import { GridStateActions } from '../store/grid/grid.actions'
import { GridMode } from '../store/grid/grid-mode.model'

@Injectable({
  providedIn: 'root',
})
export class LinksPanelsService {
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
    private linksPathService: LinksPathService,
  ) {}

  addPanelToLink(
    panel: PanelModel,
    linksState: LinksState,
    selectedStringId: string,
    shiftKey: boolean,
  ) {
    if (!panel) {
      this.store.dispatch(LinksStateActions.clearLinkState())
      this.store.dispatch(SelectedStateActions.clearSelectedState())
      this.store.dispatch(MultiActions.clearMultiState())
      this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
      console.error('addPanelToJoin !panel')
      return false
    }
    if (panel.stringId === 'undefined') {
      this.store.dispatch(LinksStateActions.clearLinkState())
      this.store.dispatch(SelectedStateActions.clearSelectedState())
      this.store.dispatch(MultiActions.clearMultiState())
      this.store.dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
      console.error('panel needs to be apart of a string')
      return false
    }

    if (linksState?.typeToLink) {
      switch (linksState.typeToLink) {
        case TypeModel.PANEL:
          firstValueFrom(
            this.linksEntity.entities$.pipe(
              map((links) => links.find((link) => link.negativeToId === panel.id)),
            ),
          ).then((existingPanelNegativeLink) => {
            if (existingPanelNegativeLink) {
              return console.error('the panel already has a negative link')
            } else {
              if (linksState.panelToLink) {
                const addPanelLink = this.joinPanelToPanel(
                  panel,
                  linksState.panelToLink!,
                  selectedStringId,
                )
                if (addPanelLink) {
                  if (shiftKey) {
                    return console.log('continue linking')
                  } else {
                    return this.store.dispatch(LinksStateActions.clearLinkState())
                  }
                } else {
                  return console.error('could not create panelLink')
                }
              } else {
                return console.error('could not find linksState.panelToLink')
              }
            }
          })
          return
        default:
          return
      }
    } else {
      firstValueFrom(
        this.linksEntity.entities$.pipe(
          map((links) => links.find((link) => link.positiveToId === panel.id)),
        ),
      ).then((existingPanelPositiveLink) => {
        if (existingPanelPositiveLink) {
          return console.error('this panel already has a positive link')
        } else {
          return this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
        }
      })
    }
    return
  }

  joinPanelToPanel(panel: PanelModel, panelToJoin: PanelModel, selectedStringId: string): boolean {
    if (!panel) {
      console.error(`joinPanelToPanel panel doesnt exist on location ${location}`)
      return false
    }

    if (panelToJoin) {
      if (panel.stringId !== panelToJoin.stringId) {
        console.error(`both panels need to be on the same string to link`)
        return false
      }
      const panelJoinRequest: PanelLinkModel = {
        isDisconnectionPoint: false,
        id: Guid.create().toString(),
        stringId: selectedStringId,
        positiveToId: panelToJoin.id,
        positiveModel: TypeModel.PANEL,
        negativeToId: panel.id,
        negativeModel: TypeModel.PANEL,
      }

      this.linksEntity.add(panelJoinRequest)
      this.store.dispatch(SelectedStateActions.clearSelectedPanelLinks())
      this.linksPathService.orderPanelsInLinkOrder(selectedStringId).then((res) => {
        console.log(res)
      })
    }

    this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
    return true
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
