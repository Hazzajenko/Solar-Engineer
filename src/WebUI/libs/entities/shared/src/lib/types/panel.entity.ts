import { CanvasEntity } from './canvas-entity'
import { PanelConfigId } from './panel-config'
import { StringId } from './string.entity'

export type CanvasPanel = Omit<CanvasEntity, 'id' | 'type'> & {
	id: PanelId
	stringId: StringId
	panelConfigId: PanelConfigId
	type: 'panel'
}

export type PanelId = string & {
	readonly _type: 'panelId'
}
