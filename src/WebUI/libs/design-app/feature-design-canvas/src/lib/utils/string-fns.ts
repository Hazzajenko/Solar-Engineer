import {
	CanvasClientStateService,
	CanvasPanel,
	createString,
	updateObjectByIdForStore,
} from '@design-app/feature-design-canvas'

export const createStringWithPanels = (
	state: CanvasClientStateService,
	selectedPanelIds: string[],
) => {
	const string = createString()

	const entities = state.entities.canvasEntities.getEntitiesByIds(selectedPanelIds)

	const panels = entities.filter((entity) => entity.type === 'panel') as CanvasPanel[]
	const panelUpdates = panels.map((panel) =>
		updateObjectByIdForStore<CanvasPanel>(panel.id, { stringId: string.id }),
	)

	return { string, panelUpdates }

	/*  state.entities.canvasStrings.addEntity(string)
	 state.entities.canvasEntities.updateManyEntities(panelUpdates)*/

	// }

	/*  const panelUpdates = panels.map((panel) => {
	 return {
	 id: panel.id,
	 changes: {

	 }
	 }
	 }*/

	/*  const stringPanels = panels.map((panel) => {
	 const stringPanel = {
	 ...panel,
	 id: panel.id + '-string',
	 parent: string.id,
	 }
	 return stringPanel
	 })*/
}