import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelLinkModel, PanelLinkRequest } from './panel-link'
import { PanelLinksActions } from './panel-links.actions'

export const PANEL_LINKS_FEATURE_KEY = 'panel-links'

export interface PanelLinksState extends EntityState<PanelLinkModel> {
	loaded: boolean
	error?: string | null
	requestingLink: PanelLinkRequest | undefined
}

export const panelLinksAdapter: EntityAdapter<PanelLinkModel> = createEntityAdapter<PanelLinkModel>(
	{
		selectId: (panelLink) => panelLink.id,
	},
)

export const initialPanelLinksState: PanelLinksState = panelLinksAdapter.getInitialState({
	loaded: false,
	requestingLink: undefined,
})

const reducer = createReducer(
	initialPanelLinksState,
	on(PanelLinksActions.startPanelLink, (state, { panelLinkRequest }) => ({
		...state,
		requestingLink: panelLinkRequest,
	})),
	on(PanelLinksActions.endPanelLink, (state) => ({
		...state,
		requestingLink: undefined,
	})),
	on(PanelLinksActions.addPanelLink, (state, { panelLink }) =>
		panelLinksAdapter.addOne(panelLink, state),
	),
	on(PanelLinksActions.addManyPanelLinks, (state, { panelLinks }) =>
		panelLinksAdapter.addMany(panelLinks, state),
	),
	on(PanelLinksActions.updatePanelLink, (state, { update }) =>
		panelLinksAdapter.updateOne(update, state),
	),
	on(PanelLinksActions.updateManyPanelLinks, (state, { updates }) =>
		panelLinksAdapter.updateMany(updates, state),
	),
	on(PanelLinksActions.deletePanelLink, (state, { panelLinkId }) =>
		panelLinksAdapter.removeOne(panelLinkId, state),
	),
	on(PanelLinksActions.deleteManyPanelLinks, (state, { panelLinkIds }) =>
		panelLinksAdapter.removeMany(panelLinkIds, state),
	),
	on(PanelLinksActions.clearPanelLinksState, () => initialPanelLinksState),
)

export function panelLinksReducer(state: PanelLinksState | undefined, action: Action) {
	return reducer(state, action)
}
