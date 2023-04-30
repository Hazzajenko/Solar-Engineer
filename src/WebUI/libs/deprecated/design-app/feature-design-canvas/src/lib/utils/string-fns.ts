import {
	CanvasClientStateService,
	CanvasPanel,
	createString,
	updateObjectByIdForStore,
} from 'deprecated/design-app/feature-design-canvas'

export const createStringWithPanels = (
	state: CanvasClientStateService,
	selectedPanelIds: string[],
) => {
	const string = createString()

	const entities = state.entities.panels.getEntitiesByIds(selectedPanelIds)

	const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
	const panelUpdates = panels.map((panel) =>
		updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
	)

	return { string, panelUpdates }
}
