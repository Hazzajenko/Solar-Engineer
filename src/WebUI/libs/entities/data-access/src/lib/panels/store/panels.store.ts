import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import { selectAllPanels, selectPanelsEntities } from './panels.selectors'
import { isNotNull } from '@shared/utils'
import { PanelsActions } from './panels.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { PanelModel } from '@entities/shared'
import { provideEffects } from '@ngrx/effects'
import { PANELS_FEATURE_KEY, panelsReducer } from './panels.reducer'
import { TransformedPoint } from '@shared/data-access/models'
import { isPointInsideEntity } from '@canvas/utils'
import * as panelsEffects from './panels.effects'
import { getPanelWithSymbolUnderMouse } from '@entities/utils'

export function providePanelsFeature() {
	return makeEnvironmentProviders([
		provideState(PANELS_FEATURE_KEY, panelsReducer),
		provideEffects(panelsEffects),
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
		getPanelUnderMouse(point: TransformedPoint) {
			return this.allPanels.find((entity) => isPointInsideEntity(point, entity))
		},
		getPanelWithSymbolUnderMouse(point: TransformedPoint) {
			return getPanelWithSymbolUnderMouse(this.allPanels, point)
			// return getPanelSymbolUnderMouse(this.allPanels, point)
			/*			const panelSymbolUnderMouse = this.allPanels.find((entity) =>
			 isPointInsidePanelSymbolsV3(point, entity),
			 )
			 return panelSymbolUnderMouse
			 ? isPointInsidePanelSymbolsV3(point, panelSymbolUnderMouse)
			 : undefined*/
		},
		addPanel(panel: PanelModel) {
			store.dispatch(PanelsActions.addPanel({ panel }))
		},
		addManyPanels(panels: PanelModel[]) {
			store.dispatch(PanelsActions.addManyPanels({ panels }))
		},
		updatePanel(update: UpdateStr<PanelModel>) {
			store.dispatch(PanelsActions.updatePanel({ update }))
		},
		updateManyPanels(updates: UpdateStr<PanelModel>[]) {
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
