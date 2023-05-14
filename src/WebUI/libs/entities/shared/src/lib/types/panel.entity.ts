import { PanelConfigId, StringId } from '@entities/shared'
import { CanvasEntity } from '@shared/data-access/models'

export type CanvasPanel = Omit<CanvasEntity, 'id' | 'type'> & {
	id: PanelId
	stringId: StringId
	panelConfigId: PanelConfigId
	type: 'panel'
}

export type PanelId = string & {
	readonly _type: 'panelId'
}
