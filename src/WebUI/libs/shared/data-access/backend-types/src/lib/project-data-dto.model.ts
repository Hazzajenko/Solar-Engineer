import { StringDto } from './string-dto.model'
import { PanelDto } from './panel-dto.model'
import { PanelLinkDto } from './panel-link-dto.model'

export interface ProjectDataDto {
	name: string
	strings: StringDto[]
	panels: PanelDto[]
	panelLinks: PanelLinkDto[]
	id: string
	createdTime: string
	lastModifiedTime: string
	createdById: string
}
