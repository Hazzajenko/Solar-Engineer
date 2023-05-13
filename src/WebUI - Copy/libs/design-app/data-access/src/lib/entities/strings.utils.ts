import { EntityStoreService } from './entity-store.service'
import { CanvasPanel, CanvasString } from '@design-app/shared'
import { createString, updateObjectByIdForStore } from '@design-app/utils'

export const genStringNameV2 = (strings: CanvasString[]): string => {
	const name = 'String'
	const count = strings.filter((s) => s.name === name).length
	return `${name}_${count}`
	// return count > 0 ? `${name} ${count}` : name
}

export const createStringWithPanels = (
	entities: EntityStoreService,
	selectedPanelIds: string[],
) => {
	const string = createString()

	const panels = entities.panels.getEntitiesByIds(selectedPanelIds)

	// const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
	const panelUpdates = panels.map((panel) =>
		updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
	)

	return { string, panelUpdates }
}