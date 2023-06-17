import { Store } from '@ngrx/store'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { PanelModel, StringId, StringModel } from '@entities/shared'
import {
	selectAllStringsExceptUndefinedString,
	selectStringById,
	selectStringsEntities,
} from './strings.selectors'
import { StringsActions } from './strings.actions'
import { EntityUpdate } from '@shared/data-access/models'

export function injectStringsStore(): StringsStore {
	return stringsStoreInjector()
}

const stringsStoreInjector = createRootServiceInjector(stringsStoreFactory, {
	deps: [Store],
})

export type StringsStore = ReturnType<typeof stringsStoreFactory>

function stringsStoreFactory(store: Store) {
	const entities = store.selectSignal(selectStringsEntities)

	const select = {
		allStrings: store.selectSignal(selectAllStringsExceptUndefinedString), // selectedString: store.selectSignal(selectSelectedString),
		getById: (id: StringId) => entities()[id],
		selectById: (id: StringId) => store.selectSignal(selectStringById({ id })),
		getByIds: (ids: StringId[]) => ids.map((id) => entities()[id]).filter(isNotNull),
	}

	const dispatch = {
		loadStrings: (strings: StringModel[]) =>
			store.dispatch(StringsActions.loadStrings({ strings })),
		addString: (string: StringModel) => store.dispatch(StringsActions.addString({ string })),
		addStringWithPanels: (string: StringModel, panelUpdates: EntityUpdate<PanelModel>[]) =>
			store.dispatch(StringsActions.addStringWithPanels({ string, panelUpdates })),
		addManyStrings: (strings: StringModel[]) =>
			store.dispatch(StringsActions.addManyStrings({ strings })),
		updateString: (update: EntityUpdate<StringModel>) =>
			store.dispatch(StringsActions.updateString({ update })),
		updateManyStrings: (updates: EntityUpdate<StringModel>[]) =>
			store.dispatch(StringsActions.updateManyStrings({ updates })),
		deleteString: (id: StringId) => store.dispatch(StringsActions.deleteString({ stringId: id })),
		deleteManyStrings: (ids: StringId[]) =>
			store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids })),
		clearStringsState: () => store.dispatch(StringsActions.clearStringsState()),
	}

	return {
		select,
		dispatch /*	get allStrings$() {
		 return store.select(selectAllStrings)
		 },
		 get allStrings() {
		 return store.selectSignal(selectAllStrings)()
		 },
		 getById(id: string) {
		 return entities()[id]
		 },
		 getByIds(ids: string[]) {
		 return ids.map((id) => entities()[id]).filter(isNotNull)
		 },
		 allStringsWithPanels() {
		 return store.selectSignal(selectAllStringsWithPanels)()
		 },
		 allStringsWithPanels$() {
		 return store.select(selectAllStringsWithPanels)
		 },
		 getStringByIdWithPanels(stringId: string) {
		 return store.selectSignal(selectStringByIdWithPanels({ stringId }))()
		 },
		 loadStrings(strings: StringModel[]) {
		 store.dispatch(StringsActions.loadStrings({ strings }))
		 },
		 addString(string: StringModel) {
		 store.dispatch(StringsActions.addString({ string }))
		 },
		 addManyStrings(strings: StringModel[]) {
		 store.dispatch(StringsActions.addManyStrings({ strings }))
		 },
		 updateString(update: UpdateStr<StringModel>) {
		 store.dispatch(StringsActions.updateString({ update }))
		 },
		 updateManyStrings(updates: UpdateStr<StringModel>[]) {
		 store.dispatch(StringsActions.updateManyStrings({ updates }))
		 },
		 deleteString(id: StringId) {
		 store.dispatch(StringsActions.deleteString({ stringId: id }))
		 },
		 deleteManyStrings(ids: StringId[]) {
		 store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids }))
		 },
		 clearStringsState() {
		 store.dispatch(StringsActions.clearStringsState())
		 },*/,
	}
}
