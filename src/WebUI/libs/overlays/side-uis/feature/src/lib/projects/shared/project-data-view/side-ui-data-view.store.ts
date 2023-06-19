import { StringId } from '@entities/shared'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

export type SideUiDataViewStoreState = {
	multiSelectedStringIds: Set<StringId>
	openedStringIds: Set<StringId>
	stringIdInAnimation: StringId | undefined
}

@Injectable({
	providedIn: 'root',
})
export class SideUiDataViewStore extends ComponentStore<SideUiDataViewStoreState> {
	readonly openedStringIds = this.selectSignal((state) => state.openedStringIds)
	readonly multiSelectedStringIds = this.selectSignal((state) => state.multiSelectedStringIds)

	readonly toggleStringView = this.updater((state, stringId: StringId) => {
		const newSet = new Set(state.openedStringIds)
		if (newSet.has(stringId)) {
			newSet.delete(stringId)
		} else {
			newSet.add(stringId)
		}
		return {
			...state,
			openedStringIds: newSet,
		}
	})

	readonly toggleMultiSelectedStringId = this.updater((state, stringId: StringId) => {
		const newSet = new Set(state.multiSelectedStringIds)
		if (newSet.has(stringId)) {
			newSet.delete(stringId)
		} else {
			newSet.add(stringId)
		}
		return {
			...state,
			multiSelectedStringIds: newSet,
		}
	})

	readonly selectAllStrings = this.updater((state, stringIds: StringId[]) => {
		const newSet = new Set(state.multiSelectedStringIds)
		stringIds.forEach((stringId) => {
			if (newSet.has(stringId)) {
				newSet.delete(stringId)
			} else {
				newSet.add(stringId)
			}
		})
		return {
			...state,
			multiSelectedStringIds: newSet,
		}
	})

	constructor() {
		super({
			multiSelectedStringIds: new Set(),
			openedStringIds: new Set(),
			stringIdInAnimation: undefined,
		})
	}
}
