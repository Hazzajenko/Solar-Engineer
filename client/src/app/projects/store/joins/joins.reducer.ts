import { createReducer, on } from '@ngrx/store'
import { JoinsStateActions } from './joins.actions'
import { PanelModel } from '../../models/panel.model'

export interface JoinsState {
  panelToJoin?: PanelModel
}

export const initialJoinsState: JoinsState = {
  panelToJoin: undefined,
}

export const joinsReducer = createReducer(
  initialJoinsState,

  on(JoinsStateActions.addToPanelJoin, (state, { panel }) => ({
    panelToJoin: panel,
  })),

  on(JoinsStateActions.clearPanelJoinState, (state) => ({
    panelToJoin: undefined,
  })),
)
