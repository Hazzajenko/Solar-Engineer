// import { EntityStoreService } from '../entity-store.service'
import { CanvasPanel, CanvasString } from '@design-app/shared'
import { createString, updateObjectByIdForStoreV3 } from '@design-app/utils'
import { EntityStoreService } from '@design-app/data-access'

export const genStringNameV2 = (strings: CanvasString[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return `${name}_${count}`
}

export const genStringNameV3 = (amountOfStrings: number): string => {
	const name = 'String'
	return `${name}_${amountOfStrings}`
}

export const createStringWithPanels = (
	entities: EntityStoreService,
	selectedPanelIds: string[],
) => {
	const string = createString()
	const panels = entities.panels.getByIds(selectedPanelIds)
	const panelUpdates = panels.map(updateObjectByIdForStoreV3<CanvasPanel>({ stringId: string.id }))

	return { string, panelUpdates }
}

export const createStringWithPanelsV2 = (selectedPanelIds: string[], amountOfStrings: number) => {
	const name = genStringNameV3(amountOfStrings)
	const string = createString(name)
	const panelUpdates = selectedPanelIds.map((panelId) => ({
		id: panelId,
		changes: { stringId: string.id },
	}))

	return { string, panelUpdates }
}
