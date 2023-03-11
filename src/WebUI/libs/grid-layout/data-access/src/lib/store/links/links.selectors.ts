import { PanelLinkModel, PanelModel } from '@shared/data-access/models'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { RouterSelectors } from '@shared/data-access/router'

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

export const selectLinksByRouteParams = createSelector(
  selectAllLinks,
  RouterSelectors.selectRouteParams,
  (links, { projectId }) =>
    links.filter((link) => link.projectId === projectId /*Number(projectId)*/),
)

export const selectLinksByPanels = (props: { panels: PanelModel[] }) =>
  createSelector(selectAllLinks, (links: PanelLinkModel[]) =>
    links.filter((link) => props.panels.map((panel) => panel.id).includes(link.panelPositiveToId)),
  )

export const selectLinksByStringId = (props: { stringId: string }) =>
  createSelector(selectAllLinks, (links: PanelLinkModel[]) =>
    links.filter((link) => link.stringId === props.stringId),
  )

export const selectLinksByPanelId = (props: { panelId: string }) =>
  createSelector(selectAllLinks, (links: PanelLinkModel[]) => {
    const panelPositiveLink = links.find((link) => link.panelPositiveToId === props.panelId)
    const panelNegativeLink = links.find((link) => link.panelNegativeToId === props.panelId)
    return {
      panelPositiveLink,
      panelNegativeLink,
    }
  })

export const selectToLinkIdWithType = createSelector(selectLinksState, (state: LinksState) => {
  return {
    type: state.typeToLink,
    toLinkId: state.toLinkId,
  }
})

export const selectToLinkId = createSelector(
  selectLinksState,
  (state: LinksState) => state.toLinkId,
)

export const selectLinkById = (props: { linkId: string }) =>
  createSelector(
    selectAllLinks,
    (links: PanelLinkModel[]) => links.find((link) => link.id === props.linkId),
    // panels.find((panel) => panel.id === props.id),
  )

export const isPanelExistingNegativeLink = (props: { panelId: string }) =>
  createSelector(selectAllLinks, (links: PanelLinkModel[]) =>
    links.find((link) => link.panelNegativeToId === props.panelId),
  )

export const isPanelExistingPositiveLink = (props: { panelId: string }) =>
  createSelector(selectAllLinks, (links: PanelLinkModel[]) =>
    links.find((link) => link.panelPositiveToId === props.panelId),
  )
