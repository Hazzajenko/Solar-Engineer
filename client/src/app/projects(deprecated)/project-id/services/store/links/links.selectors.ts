import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './links.reducer'

export const selectLinksState = createFeatureSelector<State.LinksState>('links')

// export const selectBlockToJoin = createSelector(
//   selectJoinsState,
//   (state: State.JoinsState) => state.blockToJoin,
// )

export const selectPanelToLink = createSelector(
  selectLinksState,
  (state: State.LinksState) => state.panelToLink,
)

export const selectDpToLink = createSelector(
  selectLinksState,
  (state: State.LinksState) => state.dpToLink,
)

export const selectCableToLink = createSelector(
  selectLinksState,
  (state: State.LinksState) => state.cableToLink,
)

// export const selectBlockToJoin = createSelector(
//   selectJoinsState,
//   (state: State.JoinsState) => state.blockToJoin,
// )
