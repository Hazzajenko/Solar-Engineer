import { PanelId, StringModel } from '@entities/shared'
// import { EntityStore } from '@entities/data-access'
import { createString } from './strings'

export const genStringNameV2 = (strings: StringModel[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return `${name}_${count}`
}

export const genStringNameV3 = (amountOfStrings: number): string => {
	const name = 'String'
	return `${name}_${amountOfStrings}`
}

/*export const createStringWithPanels = (entities: EntityStore, selectedPanelIds: string[]) => {
 const string = createString()
 const panels = entities.panels.select.getByIds(selectedPanelIds)
 const panelUpdates = panels.map(updateObjectByIdForStoreV3<CanvasPanel>({ stringId: string.id }))

 return { string, panelUpdates }
 }*/

export const createStringWithPanels = (selectedPanelIds: PanelId[], amountOfStrings: number) => {
	const name = genStringNameV3(amountOfStrings)
	const string = createString(name)
	const panelUpdates = selectedPanelIds.map((panelId) => ({
		id: panelId,
		changes: { stringId: string.id },
	}))

	return { string, panelUpdates }
}

/*
 export const createStringWithPanelsV3 = (selectedPanelIds: string[], amountOfStrings: number) => {
 const name = genStringNameV3(amountOfStrings)
 const string = createString(name)
 const panelUpdates = selectedPanelIds.map((panelId) => ({
 id: panelId,
 changes: { stringId: string.id },
 }))

 return { string, panelUpdates }
 }
 */

export const setPanelAsDisconnectionPointForString = (
	string: StringModel,
	panelId: PanelId,
): StringModel => {
	return {
		...string,
		disconnectionPointId: panelId,
	}
}
