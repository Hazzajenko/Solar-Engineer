import { createReducer, on } from '@ngrx/store'
import { LinksStateActions } from './links.actions'
import { PanelModel } from '@shared/data-access/models'
import { DisconnectionPointModel } from '@shared/data-access/models'
import { TypeModel } from '@shared/data-access/models'
export interface LinksState {
  // panelToJoin?: PanelModel
  // blockToJoin?: BlockModel
  typeToLink?: TypeModel
  toLinkId?: string
  panelToLink?: PanelModel
  dpToLink?: DisconnectionPointModel

}

export const initialLinksState: LinksState = {
  // panelToJoin: undefined,
  // blockToJoin: undefined,
  typeToLink: undefined,
  toLinkId: undefined,
  panelToLink: undefined,
  dpToLink: undefined,

}

export const linksReducer = createReducer(
  initialLinksState,

  on(LinksStateActions.startLinkPanel, (state, { panelId }) => ({
    typeToLink: TypeModel.PANEL,
    toLinkId: panelId,
  })),

  on(LinksStateActions.finishLinkPanel, (state, { panelId }) => ({
    typeToLink: undefined,
    toLinkId: undefined,
  })),

  on(LinksStateActions.addToLinkPanel, (state, { panel }) => ({
    typeToLink: TypeModel.PANEL,
    panelToLink: panel,
    dpToLink: undefined,
  })),

  on(LinksStateActions.addToLinkDp, (state, { disconnectionPoint }) => ({
    typeToLink: TypeModel.DISCONNECTIONPOINT,
    panelToLink: undefined,
    dpToLink: disconnectionPoint,
  })),


  on(LinksStateActions.clearPanelLinks, () => ({
    typeToLink: TypeModel.PANEL,
    panelToLink: undefined,
  })),

  on(LinksStateActions.clearLinkState, (state) => ({
    typeToLink: undefined,
    panelToLink: undefined,
    dpToLink: undefined,
  })),
)
