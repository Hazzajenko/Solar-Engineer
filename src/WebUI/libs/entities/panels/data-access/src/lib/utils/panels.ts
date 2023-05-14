import { UpdateStr } from '@ngrx/entity/src/models'
import { CanvasEntity, ENTITY_TYPE, Point } from '@shared/data-access/models'
import { EntityFactory } from '@canvas/utils'
import { CanvasPanel, PanelId } from '../types'
import { StringId, UndefinedStringId } from '@entities/strings/data-access'

export function isPanel(entity: CanvasEntity): entity is CanvasPanel {
	return entity.type === ENTITY_TYPE.Panel
}

export function assertIsPanel(entity: CanvasEntity): asserts entity is CanvasPanel {
	if (!isPanel(entity)) {
		throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
	}
}

export const createPanel = (location: Point, stringId: string = UndefinedStringId): CanvasPanel => {
	return {
		...EntityFactory.create(ENTITY_TYPE.Panel, location),
		stringId,
	} as CanvasPanel
}

export const createManyPanels = (locations: Point[], stringIds: StringId[] = []): CanvasPanel[] => {
	return locations.map((location, index) => {
		return createPanel(location, stringIds[index])
	})
}

export const PanelFactory = {
	create: (stringId: StringId, location: Point): CanvasPanel => {
		return {
			...EntityFactory.create(ENTITY_TYPE.Panel, location),
			stringId,
		} as CanvasPanel
	},
	update: (panel: CanvasPanel, changes: Partial<CanvasPanel>): CanvasPanel => {
		return {
			...EntityFactory.update(panel, changes),
			...changes,
		} as CanvasPanel
	},
	updateForStore: (
		panelId: PanelId | string,
		changes: Partial<CanvasPanel>,
	): UpdateStr<CanvasPanel> => {
		return {
			id: panelId,
			changes,
		}
	},
}
