import { createFeatureSelector, createSelector } from '@ngrx/store'
import { LINKS_FEATURE_KEY, linksAdapter, LinksState } from './links.reducer'

export const selectLinksState = createFeatureSelector<LinksState>(LINKS_FEATURE_KEY)

const { selectAll, selectEntities } = linksAdapter.getSelectors()

export const selectLinksLoaded = createSelector(
  selectLinksState,
  (state: LinksState) => state.loaded,
)

export const selectLinksError = createSelector(selectLinksState, (state: LinksState) => state.error)

export const selectAllLinks = createSelector(selectLinksState, (state: LinksState) =>
  selectAll(state),
)

export const selectLinksEntities = createSelector(selectLinksState, (state: LinksState) =>
  selectEntities(state),
)
