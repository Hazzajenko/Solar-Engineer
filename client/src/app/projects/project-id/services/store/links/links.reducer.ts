import { createReducer, on } from '@ngrx/store'
import { LinksStateActions } from './links.actions'
import { PanelModel } from '../../../../models/panel.model'
import { DisconnectionPointModel } from '../../../../models/disconnection-point.model'
import { UnitModel } from '../../../../models/unit.model'
import { CableModel } from '../../../../models/cable.model'

export interface LinksState {
  // panelToJoin?: PanelModel
  // blockToJoin?: BlockModel
  typeToLink?: UnitModel
  panelToLink?: PanelModel
  dpToLink?: DisconnectionPointModel
  cableToLink?: CableModel
}

export const initialLinksState: LinksState = {
  // panelToJoin: undefined,
  // blockToJoin: undefined,
  typeToLink: undefined,
  panelToLink: undefined,
  dpToLink: undefined,
  cableToLink: undefined,
}

export const linksReducer = createReducer(
  initialLinksState,

  on(LinksStateActions.addToLinkPanel, (state, { panel }) => ({
    typeToLink: UnitModel.PANEL,
    panelToLink: panel,
    dpToLink: undefined,
  })),

  on(LinksStateActions.addToLinkDp, (state, { disconnectionPoint }) => ({
    typeToLink: UnitModel.DISCONNECTIONPOINT,
    panelToLink: undefined,
    dpToLink: disconnectionPoint,
  })),

  on(LinksStateActions.addToLinkCable, (state, { cable }) => ({
    typeToLink: UnitModel.CABLE,
    cableToLink: cable,
  })),

  on(LinksStateActions.clearLinkState, (state) => ({
    typeToLink: undefined,
    panelToLink: undefined,
    dpToLink: undefined,
  })),
)
