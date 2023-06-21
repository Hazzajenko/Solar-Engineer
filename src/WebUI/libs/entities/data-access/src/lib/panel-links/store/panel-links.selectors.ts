import { PANEL_LINKS_FEATURE_KEY, panelLinksAdapter, PanelLinksState } from './panel-links.reducer'
import { PanelLinkModel, Polarity } from '@entities/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store'
import { groupBy } from '@shared/utils'

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

/*export const selectSelectedStringCircuit = createSelector(
 selectPanelLinksState,
 (state: PanelLinksState) => state.selectedStringCircuit,
 )*/

export const selectHoveringOverPanelPolaritySymbol = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.hoveringOverPanelPolaritySymbol,
)

export const selectMouseDownOnPanelPolaritySymbol = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.mouseDownOnPanelPolaritySymbol,
)

export const selectAllPanelLinksGroupedByStringId = createSelector(
	selectAllPanelLinks,
	(panelLinks: PanelLinkModel[]) => groupBy(panelLinks, 'stringId'),
)

// export const selectAllPanelsGroupedByStringId = createSelector(
// 	selectAllPanels,
// 	(panels: PanelModel[]) => groupBy(panels, 'stringId'),
// )

// type Projector<T> = (s1: PanelLinksState) => T
/*const panelLinksSelector = <T>(projector: Projector<T>) =>
 createSelector(selectPanelLinksState, projector)*/

/*type Example = {
 [K in keyof PanelLinksState]: {
 key: K
 }
 }[keyof PanelLinksState]*/
/*
 const exx: Example = {
 key: 'drawingPanelPolaritySymbolLine',
 }*/

const createPanelLinksSelector = <T extends keyof PanelLinksState>(projectorReturn: { key: T }) =>
	createSelector(selectPanelLinksState, (state: PanelLinksState) => state[projectorReturn.key])

export const selectDrawingPanelPolaritySymbolLine = createPanelLinksSelector({
	key: 'drawingPanelPolaritySymbolLine',
})

/*export const selectSelectedStringCircuit = createPanelLinksSelector({
 key: 'selectedStringCircuit',
 })*/

export const selectSelectedStringCircuit = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.selectedStringCircuit,
)

export const selectSelectedStringCircuitLinkLines = createSelector(
	selectPanelLinksState,
	(state: PanelLinksState) => state.selectedStringCircuit?.circuitLinkLines,
)

/*export const selectSelectedLinkModePanelId = createPanelLinksSelector({
 key: 'selectedLinkModePanelId',
 })*/

// const createPanelLinkSelector

// type Selector = ReturnType<typeof createSelector>

export type AllPanelLinksSelectors = {
	[T in keyof PanelLinksState]: MemoizedSelector<
		object,
		PanelLinksState[T],
		(s1: PanelLinksState) => PanelLinksState[T]
	>
}
/*export const allPanelLinksSelectors = () => {
 const res: AllPanelLinksSelectors = {} as AllPanelLinksSelectors
 Object.keys(initialPanelLinksState).forEach((key) => {
 const selector = createSelector(
 selectPanelLinksState,
 (state: PanelLinksState) => state[key as keyof PanelLinksState],
 )
 const k = key as keyof PanelLinksState
 res[k] = selector as MemoizedSelector<
 object,
 PanelLinksState[k],
 (s1: PanelLinksState) => PanelLinksState[k]
 >
 })
 // PanelLinksState['']
 /!*	Object.keys(initialPanelLinksState).map(
 (key) =>
 createSelector(
 selectPanelLinksState,
 (state: PanelLinksState) => state[key as keyof PanelLinksState],
 ),
 )*!/
 }*/

/*export const selectDrawingPanelPolaritySymbolLine = panelLinksSelector(
 (state: PanelLinksState) => state.drawingPanelPolaritySymbolLine,
 )*/
/*export const selectDrawingPanelPolaritySymbolLine = createSelector(
 selectPanelLinksState,
 (state: PanelLinksState) => state.drawingPanelPolaritySymbolLine,
 )*/

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
