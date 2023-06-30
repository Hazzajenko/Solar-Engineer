import { STRING_MODEL, StringModel } from '../strings'
import { PANEL_MODEL, PanelModel } from '../panels'
import { PANEL_LINK_MODEL, PanelLinkModel } from '../panel-links'
import { PANEL_CONFIG_MODEL, PanelConfigModel } from '../panel-configs'
import { z } from 'zod'

export type ProjectLocalStorageModel = {
	project: ProjectInfoModel
	strings: StringModel[]
	panels: PanelModel[]
	panelLinks: PanelLinkModel[]
	panelConfigs: PanelConfigModel[]
}

export type ProjectLocalStorageEntities = Omit<ProjectLocalStorageModel, 'project'>

export const PROJECT_LOCAL_STORAGE_ENTITIES = {
	strings: z.array(STRING_MODEL),
	panels: z.array(PANEL_MODEL),
	panelLinks: z.array(PANEL_LINK_MODEL),
	panelConfigs: z.array(PANEL_CONFIG_MODEL),
}

export type ProjectInfoModel = {
	createdTime: string
	lastModifiedTime: string
}

export const PROJECT_INFO_MODEL = z.object({
	createdTime: z.string(),
	lastModifiedTime: z.string(),
})

export const PROJECT_LOCAL_STORAGE_MODEL = {
	project: PROJECT_INFO_MODEL,
	strings: z.array(STRING_MODEL),
	panels: z.array(PANEL_MODEL),
	panelLinks: z.array(PANEL_LINK_MODEL),
	panelConfigs: z.array(PANEL_CONFIG_MODEL),
}

// export const PROJECT_LOCAL_STORAGE_MODEL = z.object({
// 	project: PROJECT_INFO_MODEL,
// 	strings: z.array(STRING_MODEL),
// 	panels: z.array(PANEL_MODEL),
// 	panelLinks: z.array(PANEL_LINK_MODEL),
// 	panelConfigs: z.array(PANEL_CONFIG_MODEL),
// })
