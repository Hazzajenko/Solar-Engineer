import { ENTITY_TYPE, EntityBase } from '../common'
import { Polarity } from '../panel-links'
import { StringId } from '../strings'
import { PanelConfigId } from '../panel-configs'
import { BackendDataModel } from '../backend-data/backend-data.model'

export type PanelBackendModel = PanelModel & BackendDataModel

export type PanelModel = Omit<EntityBase, 'id' | 'type'> & {
	id: PanelId
	stringId: StringId
	panelConfigId: PanelConfigId
	type: typeof ENTITY_TYPE.PANEL
}

export type PanelId = string & {
	readonly _type: 'panelId'
}

export type PanelSymbol = {
	panelId: PanelId
	symbol: Polarity
}

export type PanelWithSymbol = PanelModel & {
	symbol: Polarity
}
