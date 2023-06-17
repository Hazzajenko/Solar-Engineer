import { StringId } from '@entities/shared'
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

export type SideUiDataViewStoreState = {
	multiSelectedStringIds: Set<StringId>
	// openedStringIds: Set<StringId>
	openedStringId: StringId | undefined
}

@Injectable({
	providedIn: 'root',
})
export class SideUiDataViewStore extends ComponentStore<SideUiDataViewStoreState> {
	// readonly panelsGroupedByStringId$ = this.select(selectPanelsGroupedWithStringsAndStats)
	// readonly panelsGroupedByStringId = this.selectSignal(selectPanelsGroupedWithStringsAndStats)

	readonly openedStringId = this.selectSignal((state) => state.openedStringId)
	// readonly openedStringIds = this.selectSignal((state) => state.openedStringIds)
	readonly multiSelectedStringIds = this.selectSignal((state) => state.multiSelectedStringIds)

	readonly toggleStringView = this.updater((state, stringId: StringId) => {
		/*		const newSet = new Set(state.openedStringIds)
		 if (newSet.has(stringId)) {
		 newSet.delete(stringId)
		 } else {
		 newSet.add(stringId)
		 }*/
		if (state.openedStringId === stringId) {
			return {
				...state,
				openedStringId: undefined,
			}
		}
		return {
			...state,
			openedStringId: stringId,
		}
	})

	readonly setMultiSelectedStringIds = this.updater(
		(state, multiSelectedStringIds: Set<StringId>) => ({
			...state,
			multiSelectedStringIds,
		}),
	)
	readonly clearMultiSelectedStringIds = this.updater((state) => ({
		...state,
		multiSelectedStringIds: new Set(),
	}))
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

	/*	readonly deleteSelectedStrings = this.updater((state) => {
	 const selectedStringIds = [...state.multiSelectedStringIds]
	 this._entityStore.strings.dispatch.deleteManyStrings(selectedStringIds)

	 return {
	 ...state,
	 multiSelectedStringIds: new Set(),
	 }
	 })*/

	/*	readonly selectAllStrings = this.updater((state) => {
	 const set = new Set<StringId>()
	 this._entityStore.strings.select.allStrings().forEach((string) => set.add(string.id))
	 return {
	 ...state,
	 multiSelectedStringIds: set,
	 }
	 }*/

	constructor() {
		super({
			multiSelectedStringIds: new Set(),
			openedStringId: undefined,
		})
	}
}

/*

 export const selectPanelsGroupedWithStringsAndStats = createSelector(
 selectStringsEntities,
 selectPanelConfigsEntities,
 selectAllPanelsGroupedByStringId,
 selectAllPanelLinksGroupedByStringId,
 (
 strings: Dictionary<StringModel>,
 panelConfigs: Dictionary<PanelConfigModel>,
 panelsGroupedByStringId: Record<StringId, PanelModel[]>,
 panelLinksGroupedByStringId: Record<StringId, PanelLinkModel[]>,
 ) => {
 const entries = Object.entries(panelsGroupedByStringId)
 return entries.map(([stringId, stringPanels]) => {
 const string = strings[stringId]
 assertNotNull(string)
 const panelLinksForString = panelLinksGroupedByStringId[string.id] ?? []
 const panelsWithSpecs = stringPanels.map((panel) => {
 const panelConfig = panelConfigs[panel.panelConfigId]
 assertNotNull(panelConfig)
 return mapPanelToPanelWithConfig(panel, panelConfig)
 })
 const stats = calculateStringStatsForSelectedString(
 stringPanels,
 panelLinksForString,
 panelsWithSpecs,
 )
 return {
 string,
 panels: stringPanels,
 stats,
 } as StringWithPanelsAndStats
 })
 },
 )
 */
