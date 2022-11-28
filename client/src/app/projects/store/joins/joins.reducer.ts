import { createReducer, on } from '@ngrx/store'
import { JoinsStateActions } from './joins.actions'
import { PanelModel } from '../../models/panel.model'
import { BlockModel } from '../../models/block.model'
import { DisconnectionPointModel } from '../../models/disconnection-point.model'
import { UnitModel } from '../../models/unit.model'

export interface JoinsState {
  // panelToJoin?: PanelModel
  // blockToJoin?: BlockModel
  typeToJoin?: UnitModel
  panelToJoin?: PanelModel
  dpToJoin?: DisconnectionPointModel
}

export const initialJoinsState: JoinsState = {
  // panelToJoin: undefined,
  // blockToJoin: undefined,
  typeToJoin: undefined,
  panelToJoin: undefined,
  dpToJoin: undefined,
}

export const joinsReducer = createReducer(
  initialJoinsState,

  on(JoinsStateActions.addToJoinPanel, (state, { panel }) => ({
    typeToJoin: UnitModel.PANEL,
    panelToJoin: panel,
    dpToJoin: undefined,
  })),

  on(JoinsStateActions.addToJoinDp, (state, { disconnectionPoint }) => ({
    typeToJoin: UnitModel.DISCONNECTIONPOINT,
    panelToJoin: undefined,
    dpToJoin: disconnectionPoint,
  })),

  on(JoinsStateActions.clearPanelJoinState, (state) => ({
    typeToJoin: UnitModel.UNDEFINED,
    panelToJoin: undefined,
    dpToJoin: undefined,
  })),
)
