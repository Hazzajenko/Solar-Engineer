import { Point } from '@shared/data-access/models'

export interface PanelDto {
	type: string
	stringId: string
	panelConfigId: string
	location: Point
	angle: number
	id: string
	createdTime: string
	lastModifiedTime: string
	createdById: string
}
