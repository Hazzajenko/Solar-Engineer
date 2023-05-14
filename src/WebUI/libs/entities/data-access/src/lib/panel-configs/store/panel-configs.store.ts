import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectAllPanelConfigs, selectPanelConfigsEntities } from './panel-configs.selectors'
import { isNotNull } from '@shared/utils'
import { PanelConfig } from '@entities/shared'
import { PanelConfigsActions } from './panel-configs.actions'
import { UpdateStr } from '@ngrx/entity/src/models'

export function injectPanelConfigsStore() {
	const store = inject(Store)
	const allPanelConfigs = store.selectSignal(selectAllPanelConfigs)
	const entities = store.selectSignal(selectPanelConfigsEntities)

	return {
		get allPanelConfigs() {
			return allPanelConfigs
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		addPanelConfig(panelConfig: PanelConfig) {
			store.dispatch(PanelConfigsActions.addPanelConfig({ panelConfig }))
		},
		addManyPanelConfigs(panelConfigs: PanelConfig[]) {
			store.dispatch(PanelConfigsActions.addManyPanelConfigs({ panelConfigs }))
		},
		updatePanelConfig(update: UpdateStr<PanelConfig>) {
			store.dispatch(PanelConfigsActions.updatePanelConfig({ update }))
		},
		updateManyPanelConfigs(updates: UpdateStr<PanelConfig>[]) {
			store.dispatch(PanelConfigsActions.updateManyPanelConfigs({ updates }))
		},
		deletePanelConfig(id: string) {
			store.dispatch(PanelConfigsActions.deletePanelConfig({ panelConfigId: id }))
		},
		deleteManyPanelConfigs(ids: string[]) {
			store.dispatch(PanelConfigsActions.deleteManyPanelConfigs({ panelConfigIds: ids }))
		},
		clearPanelConfigsState() {
			store.dispatch(PanelConfigsActions.clearPanelConfigsState())
		},
	}
}

export type PanelConfigsStore = ReturnType<typeof injectPanelConfigsStore>
