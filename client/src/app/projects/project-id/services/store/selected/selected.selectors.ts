import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './selected.reducer'

export const selectSelectedState =
  createFeatureSelector<State.SelectedState>('selected')

export const selectSelectedUnitAndIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state,
)

export const selectUnitSelected = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.unit,
)

export const selectMultiSelectUnit = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelectUnit,
)
export const selectIfMultiSelect = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelect,
)

export const selectSelectedId = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.singleSelectId,
)

export const selectMultiSelectIds = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.multiSelectIds,
)

export const selectSelectedPositiveTo = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedPositiveLinkTo,
)

export const selectSelectedNegativeTo = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedNegativeLinkTo,
)

export const selectSelectedStringTooltip = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.selectedStringTooltip,
)

/*
export const selectSelectedPanels = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.panels,
)

export const selectSelectedStrings = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.strings,
)

export const selectSelectedDisconnectionPoint = createSelector(
  selectSelectedState,
  (state: State.SelectedState) => state.disconnectionPoint,
)
*/
