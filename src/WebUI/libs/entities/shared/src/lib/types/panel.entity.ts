import { CanvasEntity } from './canvas-entity'
import { PanelConfigId } from './panel-config'
import { StringId } from './string.entity'
import { Polarity } from './panel-link'

export type CanvasPanel = Omit<CanvasEntity, 'id' | 'type'> & {
	id: PanelId
	stringId: StringId
	panelConfigId: PanelConfigId
	type: 'panel'
}

export type PanelId = string & {
	readonly _type: 'panelId'
}

export type PanelSymbol = {
	panelId: PanelId
	symbol: Polarity
}
