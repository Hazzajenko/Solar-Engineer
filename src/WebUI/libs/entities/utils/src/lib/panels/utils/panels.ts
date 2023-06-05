import { UpdateStr } from '@ngrx/entity/src/models'
import { Point } from '@shared/data-access/models'
import { EntityFactory } from '@canvas/utils'
import {
	DEFAULT_PANEL_CONFIG_ID,
	ENTITY_TYPE,
	EntityBase,
	PanelConfigId,
	PanelId,
	PanelModel,
	StringId,
	UNDEFINED_STRING_ID,
} from '@entities/shared'

export function isPanel(entity: EntityBase | PanelModel): entity is PanelModel {
	return entity.type === ENTITY_TYPE.PANEL
}

export function assertIsPanel(entity: EntityBase | PanelModel): asserts entity is PanelModel {
	if (!isPanel(entity)) {
		throw new Error(`Expected entity to be a panel, but was ${entity.type}`)
	}
}

export const createPanel = (
	location: Point,
	stringId: string = UNDEFINED_STRING_ID,
	panelConfigId: PanelConfigId = DEFAULT_PANEL_CONFIG_ID,
): PanelModel => {
	return {
		...EntityFactory.create(ENTITY_TYPE.PANEL, location),
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
			...EntityFactory.create(ENTITY_TYPE.PANEL, location),
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
