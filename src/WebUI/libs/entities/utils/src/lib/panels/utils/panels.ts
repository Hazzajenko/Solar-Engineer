import { UpdateStr } from '@ngrx/entity/src/models'
import { Point } from '@shared/data-access/models'
import { EntityFactory } from '@canvas/utils'
import {
	CanvasEntity,
	DefaultPanelConfigId,
	ENTITY_TYPE,
	PanelConfigId,
	PanelId,
	PanelModel,
	StringId,
	UndefinedStringId,
} from '@entities/shared'

export function isPanel(entity: CanvasEntity | PanelModel): entity is PanelModel {
	return entity.type === ENTITY_TYPE.Panel
}

export function assertIsPanel(entity: CanvasEntity | PanelModel): asserts entity is PanelModel {
	if (!isPanel(entity)) {
		throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
	}
}

export const createPanel = (
	location: Point,
	stringId: string = UndefinedStringId,
	panelConfigId: PanelConfigId = DefaultPanelConfigId,
): PanelModel => {
	return {
		...EntityFactory.create(ENTITY_TYPE.Panel, location),
		stringId,
		panelConfigId,
	} as PanelModel
}

export const createManyPanels = (locations: Point[], stringIds: StringId[] = []): PanelModel[] => {
	return locations.map((location, index) => {
		return createPanel(location, stringIds[index])
	})
}

export const PanelFactory = {
	create: (stringId: StringId, location: Point): PanelModel => {
		return {
			...EntityFactory.create(ENTITY_TYPE.Panel, location),
			stringId,
		} as PanelModel
	},
	update: (panel: PanelModel, changes: Partial<PanelModel>): PanelModel => {
		return {
			...EntityFactory.update(panel, changes),
			...changes,
		} as PanelModel
	},
	updateForStore: (
		panelId: PanelId | string,
		changes: Partial<PanelModel>,
	): UpdateStr<PanelModel> => {
		return {
			id: panelId,
			changes,
		}
	},
}
