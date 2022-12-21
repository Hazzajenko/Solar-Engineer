import { createReducer, on } from '@ngrx/store'
import { LinksStateActions } from './links.actions'
import { PanelModel } from '../../../../models/panel.model'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { TypeModel } from '../../../../models/type.model'
import { CableModel } from '../../../../models/deprecated-for-now/cable.model'

export interface LinksState {
  // panelToJoin?: PanelModel
  // blockToJoin?: BlockModel
  typeToLink?: TypeModel
  toLinkId?: string
  panelToLink?: PanelModel
  dpToLink?: DisconnectionPointModel
  cableToLink?: CableModel
}

export const initialLinksState: LinksState = {
  // panelToJoin: undefined,
  // blockToJoin: undefined,
  typeToLink: undefined,
  toLinkId: undefined,
  panelToLink: undefined,
  dpToLink: undefined,
  cableToLink: undefined,
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

  on(LinksStateActions.addToLinkCable, (state, { cable }) => ({
    typeToLink: TypeModel.CABLE,
    cableToLink: cable,
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
