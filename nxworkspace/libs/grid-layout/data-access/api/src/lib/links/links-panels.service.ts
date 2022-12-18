
import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Store } from '@ngrx/store'

import { Guid } from 'guid-typescript'

import { LinksPathService } from './links-path.service'

import { firstValueFrom } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  DisconnectionPointsEntityService, GridStateActions, LinksState, LinksStateActions,
  MultiActions,
  PanelLinksEntityService,
  SelectedStateActions,
} from '@grid-layout/data-access/store'
import { DisconnectionPointModel, GridMode, PanelLinkModel, PanelModel, TypeModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'


@Injectable({
  providedIn: 'root',
})
export class LinksPanelsService {
  private store = inject(Store<AppState>)
  private panelLinksEntity = inject(PanelLinksEntityService)
  private disconnectionPointsEntity = inject(DisconnectionPointsEntityService)
  private linksPathService = inject(LinksPathService)


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
            this.panelLinksEntity.entities$.pipe(
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
        this.panelLinksEntity.entities$.pipe(
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

      this.panelLinksEntity.add(panelJoinRequest)
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

      this.panelLinksEntity.add(panelJoinRequest)
    }

    this.store.dispatch(LinksStateActions.addToLinkPanel({ panel }))
  }
}
