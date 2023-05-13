import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on, provideState, Store } from '@ngrx/store'
import { PanelLinkModel, PanelLinkRequest } from '../types'
import { PanelLinksActions } from './panel-links.actions'
import { inject, makeEnvironmentProviders } from '@angular/core'
import { isNotNull } from '@shared/utils'
import { UpdateStr } from '@ngrx/entity/src/models'
import { selectAllPanelLinks, selectPanelLinksEntities } from './panel-links.selectors'

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

export function providePanelLinksFeature() {
	return makeEnvironmentProviders([provideState(PANEL_LINKS_FEATURE_KEY, panelLinksReducer)])
}

export function injectPanelLinksFeature() {
	const store = inject(Store)
	const allPanelLinks = store.selectSignal(selectAllPanelLinks)
	const entities = store.selectSignal(selectPanelLinksEntities)

	return {
		get allPanelLinks() {
			return allPanelLinks
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		addPanelLink(panelLink: PanelLinkModel) {
			store.dispatch(PanelLinksActions.addPanelLink({ panelLink }))
		},
		addManyPanelLinks(panelLinks: PanelLinkModel[]) {
			store.dispatch(PanelLinksActions.addManyPanelLinks({ panelLinks }))
		},
		updatePanelLink(update: UpdateStr<PanelLinkModel>) {
			store.dispatch(PanelLinksActions.updatePanelLink({ update }))
		},
		updateManyPanelLinks(updates: UpdateStr<PanelLinkModel>[]) {
			store.dispatch(PanelLinksActions.updateManyPanelLinks({ updates }))
		},
		deletePanelLink(panelLinkId: string) {
			store.dispatch(PanelLinksActions.deletePanelLink({ panelLinkId }))
		},
		deleteManyPanelLinks(panelLinkIds: string[]) {
			store.dispatch(PanelLinksActions.deleteManyPanelLinks({ panelLinkIds }))
		},
		clearPanelLinksState() {
			store.dispatch(PanelLinksActions.clearPanelLinksState())
		},
	}
}
