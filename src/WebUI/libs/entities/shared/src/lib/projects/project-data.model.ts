import { ProjectUserModel } from './project.model'
import { StringModel } from '../strings'
import { PanelModel } from '../panels'
import { PanelLinkModel } from '../panel-links'
import { PanelConfigModel } from '../panel-configs'

export type ProjectDataModel = {
	id: string
	name: string
	colour: string
	memberIds: string[]
	members: ProjectUserModel[]
	createdTime: string
	lastModifiedTime: string
	createdById: string
	undefinedStringId: string
	strings: StringModel[]
	panels: PanelModel[]
	panelLinks: PanelLinkModel[]
	panelConfigs: PanelConfigModel[]
}
