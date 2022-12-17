import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as State from './string-panels.reducer'
import { selectRouteParams } from '../../../store/router.selectors'

export const selectStringPanelsState = createFeatureSelector<State.StringPanelState>('stringPanels')

export const selectStringPanelEntities = createSelector(
  selectStringPanelsState,
  State.selectEntities,
)

export const selectAllStringPanels = createSelector(selectStringPanelsState, State.selectAll)

export const selectStringPanelByRouteParams = createSelector(
  selectStringPanelEntities,
  selectRouteParams,
  (stringPanels, { stringPanelId }) => stringPanels[stringPanelId],
)

export const selectStringPanelsByStringIdRouteParams = createSelector(
  selectAllStringPanels,
  selectRouteParams,
  (stringPanels, { stringId }) =>
    stringPanels.filter((stringPanel) => stringPanel.stringId === Number(stringId)),
)
