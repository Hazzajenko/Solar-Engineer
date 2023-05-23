import { PANEL_LINKS_FEATURE_KEY, panelLinksAdapter, PanelLinksState } from './panel-links.reducer'
import { PanelLinkModel, Polarity } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectPanelLinksState = createFeatureSelector<PanelLinksState>(PANEL_LINKS_FEATURE_KEY)

const { selectAll, selectEntities } = panelLinksAdapter.getSelectors()

export const selectAllPanelLinks = createSelector(selectPanelLinksState, (state: PanelLinksState) =>
	selectAll(state),
)

export const selectPanelLinksEntities = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => selectEntities(state),
)

export const selectPanelLinkById = (props: { id: string }) =>
	createSelector(
		selectPanelLinksEntities,
		(panelLinks: Dictionary<PanelLinkModel>) => panelLinks[props.id],
	)

export const selectPanelLinksByPanelId = (props: { panelId: string }) =>
	createSelector(selectAllPanelLinks, (panelLinks: PanelLinkModel[]) =>
		panelLinks.filter(
			(panelLink) =>
				panelLink.positivePanelId === props.panelId || panelLink.negativePanelId === props.panelId,
		),
	)

export const selectIsPanelLinkExisting = (props: { panelId: string; polarity: Polarity }) =>
	createSelector(
		selectAllPanelLinks,
		(
			panelLinks: PanelLinkModel[] /*		panelLinks.some(
 (panelLink) =>
 (panelLink.positivePanelId === props.panelId && props.polarity === 'positive') ||
 (panelLink.negativePanelId === props.panelId && props.polarity === 'negative'),
 ),*/,
		) =>
			!!panelLinks.find(
				(panelLink) =>
					(panelLink.positivePanelId === props.panelId && props.polarity === 'positive') ||
					(panelLink.negativePanelId === props.panelId && props.polarity === 'negative'),
			),
	)

export const selectPanelLinksByStringId = (props: { stringId: string }) =>
	createSelector(selectAllPanelLinks, (panelLinks: PanelLinkModel[]) =>
		panelLinks.filter((panelLink) => panelLink.stringId === props.stringId),
	)

export const selectPanelLinksByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllPanelLinks, (panelLinks: PanelLinkModel[]) =>
		panelLinks.filter((panelLink) => props.ids.includes(panelLink.id)),
	)

export const selectRequestingLink = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.requestingLink,
)

export const selectHoveringOverPanelInLinkMenuId = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.hoveringOverPanelInLinkMenuId,
)

export const selectHoveringOverPanelLinkInLinkMenu = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.hoveringOverPanelLinkInLinkMenu,
)

export const selectHoveringOverPanelLinkIdInApp = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.hoveringOverPanelLinkInApp,
)

export const selectHoveringOverPanelLinkInApp = createSelector(
	selectHoveringOverPanelLinkIdInApp,
	selectPanelLinksEntities,
	(hoveringOverPanelLinkIdInApp: string | undefined, panelLinks: Dictionary<PanelLinkModel>) =>
		hoveringOverPanelLinkIdInApp ? panelLinks[hoveringOverPanelLinkIdInApp] : undefined,
)

export const selectSelectedStringCircuit = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.selectedStringCircuit,
)

export const selectHoveringOverPanelPolaritySymbol = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.hoveringOverPanelPolaritySymbol,
)

/*
 export const selectPanelLinksForSelectedString = createSelector(
 selectAllPanelLinks,
 selectSelectedString,
 (panelLinks: PanelLinkModel[], selectedString: CanvasString | undefined) =>
 selectedString
 ? panelLinks.filter((panelLink) => panelLink.stringId === selectedString.id)
 : undefined,
 )
 */
