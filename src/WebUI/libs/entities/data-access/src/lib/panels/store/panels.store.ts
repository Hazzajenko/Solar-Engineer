import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import { selectAllPanels, selectPanelsEntities } from './panels.selectors'
import { isNotNull } from '@shared/utils'
import { PanelsActions } from './panels.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CanvasPanel } from '@entities/shared'
import { provideEffects } from '@ngrx/effects'
import { removeSelectedIfDeleted$, updatePanelLinkPaths$ } from './panels.effects'
import { PANELS_FEATURE_KEY, panelsReducer } from './panels.reducer'
import { TransformedPoint } from '@shared/data-access/models'
import { isPointInsideEntity } from '@canvas/utils'

export function providePanelsFeature() {
	return makeEnvironmentProviders([
		provideState(PANELS_FEATURE_KEY, panelsReducer),
		provideEffects({ removeSelectedIfDeleted$, updatePanelLinkPaths$ }),
	])
}

export function injectPanelsStore() {
	const store = inject(Store)
	const allPanels$ = store.select(selectAllPanels)
	const allPanels = store.selectSignal(selectAllPanels)
	const entities = store.selectSignal(selectPanelsEntities)

	return {
		get allPanels$() {
			return allPanels$
		},
		get allPanels() {
			return store.selectSignal(selectAllPanels)()
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		getByStringId(stringId: string) {
			return allPanels().filter((panel) => panel.stringId === stringId)
		},
		getEntityUnderMouse(point: TransformedPoint) {
			return this.allPanels.find((entity) => isPointInsideEntity(point, entity))
		},
		addPanel(panel: CanvasPanel) {
			store.dispatch(PanelsActions.addPanel({ panel }))
		},
		addManyPanels(panels: CanvasPanel[]) {
			store.dispatch(PanelsActions.addManyPanels({ panels }))
		},
		updatePanel(update: UpdateStr<CanvasPanel>) {
			store.dispatch(PanelsActions.updatePanel({ update }))
		},
		updateManyPanels(updates: UpdateStr<CanvasPanel>[]) {
			store.dispatch(PanelsActions.updateManyPanels({ updates }))
		},
		deletePanel(id: string) {
			store.dispatch(PanelsActions.deletePanel({ panelId: id }))
		},
		deleteManyPanels(ids: string[]) {
			store.dispatch(PanelsActions.deleteManyPanels({ panelIds: ids }))
		},
		clearPanelsState() {
			store.dispatch(PanelsActions.clearPanelsState())
		},
	}
}

export type PanelsStore = ReturnType<typeof injectPanelsStore>
