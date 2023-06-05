import { createRootServiceInjector } from '@shared/utils'
import { Store } from '@ngrx/store'
import { selectSelectedStringIdOrUndefinedString } from '@canvas/selected/data-access'

export function injectSelectedStringId() {
	return selectedStringIdInjector()
}

const selectedStringIdInjector = createRootServiceInjector(selectedStringIdFactory, {
	deps: [Store],
})

function selectedStringIdFactory(store: Store) {
	return store.selectSignal(selectSelectedStringIdOrUndefinedString)
}

/*
 export function injectSelectedStringId() {
 return selectedStringIdInjector()
 }

 const selectedStringIdInjector = createRootServiceInjector(selectedStringIdFactory, {
 deps: [Store],
 })

 const selectSelectedStringId = createSelector(
 selectSelectedStringIdId,
 selectStringsEntities,
 (selectedStringIdId: StringId | undefined, strings: Dictionary<StringModel>) =>
 selectedStringIdId ? strings[selectedStringIdId] : undefined,
 )

 function selectedStringIdFactory(store: Store) {
 return store.selectSignal(selectSelectedStringId)
 }
 */
