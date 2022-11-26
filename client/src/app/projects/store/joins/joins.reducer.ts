import { createReducer, on } from '@ngrx/store'
import { JoinsStateActions } from './joins.actions'
import { PanelModel } from '../../models/panel.model'
import { BlockModel } from '../../models/block.model'

export interface JoinsState {
  panelToJoin?: PanelModel
  blockToJoin?: BlockModel
}

export const initialJoinsState: JoinsState = {
  panelToJoin: undefined,
  blockToJoin: undefined,
}

export const joinsReducer = createReducer(
  initialJoinsState,

  on(JoinsStateActions.addToPanelJoin, (state, { panel }) => ({
    panelToJoin: panel,
  })),

  on(JoinsStateActions.addToBlockJoin, (state, { block }) => ({
    blockToJoin: block,
  })),

  on(JoinsStateActions.clearPanelJoinState, (state) => ({
    panelToJoin: undefined,
    blockToJoin: undefined,
  })),
)
