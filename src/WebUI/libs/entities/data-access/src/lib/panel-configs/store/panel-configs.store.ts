import { Store } from '@ngrx/store'
import { selectAllPanelConfigs, selectPanelConfigsEntities } from './panel-configs.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { PanelConfigModel } from '@entities/shared'
import { PanelConfigsActions } from './panel-configs.actions'
import { UpdateStr } from '@ngrx/entity/src/models'

export function injectPanelConfigsStore(): PanelConfigsStore {
	return panelConfigsStoreInjector()
}

const panelConfigsStoreInjector = createRootServiceInjector(panelConfigsStoreFactory, {
	deps: [Store],
})

export type PanelConfigsStore = ReturnType<typeof panelConfigsStoreFactory>

export function panelConfigsStoreFactory(store: Store) {
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
		loadPanelConfigs(panelConfigs: PanelConfigModel[]) {
			store.dispatch(PanelConfigsActions.loadPanelConfigs({ panelConfigs }))
		},
		addPanelConfig(panelConfig: PanelConfigModel) {
			store.dispatch(PanelConfigsActions.addPanelConfig({ panelConfig }))
		},
		addManyPanelConfigs(panelConfigs: PanelConfigModel[]) {
			store.dispatch(PanelConfigsActions.addManyPanelConfigs({ panelConfigs }))
		},
		updatePanelConfig(update: UpdateStr<PanelConfigModel>) {
			store.dispatch(PanelConfigsActions.updatePanelConfig({ update }))
		},
		updateManyPanelConfigs(updates: UpdateStr<PanelConfigModel>[]) {
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
