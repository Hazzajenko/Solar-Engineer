import { CanvasEntity } from './canvas-entity'
import { StringId } from './canvas-string'
import { PanelConfigId } from '@design-app/data-access'

export type CanvasPanel = Omit<CanvasEntity, 'id' | 'type'> & {
	id: PanelId
	stringId: StringId
	panelConfigId: PanelConfigId
	type: 'panel'
}

export type PanelId = string & {
	readonly _type: 'panelId'
}

// export function isPanel(entity: CanvasEntity): entity is CanvasPanel {
// 	return entity.type === ENTITY_TYPE.Panel
// }
//
// export function assertIsPanel(entity: CanvasEntity): asserts entity is CanvasPanel {
// 	if (!isPanel(entity)) {
// 		throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
// 	}
// }
//
// export const createPanel = (location: Point, stringId?: string): CanvasPanel => {
// 	return {
// 		...EntityFactory.create(ENTITY_TYPE.Panel, location),
// 		stringId,
// 	} as CanvasEntity & {
// 		id: PanelId
// 		stringId: StringId
// 	}
// }
//
// export const createManyPanels = (locations: Point[], stringIds: StringId[] = []): CanvasPanel[] => {
// 	return locations.map((location, index) => {
// 		return createPanel(location, stringIds[index])
// 	})
// }
//
// export const PanelFactory = {
// 	create: (stringId: StringId, location: Point): CanvasPanel => {
// 		return {
// 			...EntityFactory.create(ENTITY_TYPE.Panel, location),
// 			stringId,
// 		} as CanvasEntity & {
// 			id: PanelId
// 			stringId: StringId
// 		}
// 	},
// 	update: (panel: CanvasPanel, changes: Partial<CanvasPanel>): CanvasPanel => {
// 		return {
// 			...EntityFactory.update(panel, changes),
// 			...changes,
// 		} as CanvasEntity & {
// 			id: PanelId
// 			stringId: StringId
// 		}
// 	},
// 	updateForStore: (
// 		panelId: PanelId | string,
// 		changes: Partial<CanvasPanel>,
// 	): UpdateStr<CanvasPanel> => {
// 		return {
// 			id: panelId,
// 			changes,
// 		}
// 	},
// }
