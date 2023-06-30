import { PROJECT_TEMPLATE, ProjectTemplate } from '../project-template.model'
import SixRowsOfPanels_Panels from './template__12-rows-no-strings/panels.json'
// import * as SixRowsOfPanels_Panels from './template__12-rows-no-strings/panels.json'
import * as SixRowsOfPanelsInStrings_Panels from './template__12-rows-6-strings/panels.json'
import * as SixRowsOfPanelsInStrings_Strings from './template__12-rows-6-strings/strings.json'
import * as SixRowsOfPanelsInStringsAndPanelLinks_Panels from './template__12-rows-6-strings-with-links/panels.json'
import * as SixRowsOfPanelsInStringsAndPanelLinks_Strings from './template__12-rows-6-strings-with-links/strings.json'
import * as SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks from './template__12-rows-6-strings-with-links/panel-links.json'
import { PANEL_MODEL, PanelModel } from '../../panels'
import { STRING_MODEL, StringModel } from '../../strings'
import { PANEL_LINK_MODEL, PanelLinkModel } from '../../panel-links'
import { PANEL_CONFIG_MODEL, PanelConfigModel } from '../../panel-configs'
import { z } from 'zod'
// import { StringModel } from '../../strings'
// import { data } from 'autoprefixer'
// import { data } from 'autoprefixer'

// data = require('./six-rows-of-panels-in-strings-and-panel-links/strings.json')

// const fetchPanelsJson = async () => {
// 	return await import('./six-rows-of-panels/panels.json')
// }

// const fetchPanelsJson = async () => {
// 	const data = await import('./six-rows-of-panels/panels.json')
// 	return Object.values(data.values())
// }

export const fetchProjectTemplateData = async (templateName: ProjectTemplate['templateName']) => {
	const panelsPromise = import(`./${templateName}/panels.json`)
	const stringsPromise = import(`./${templateName}/strings.json`)
	const panelLinksPromise = import(`./${templateName}/panel-links.json`)
	const panelConfigsPromise = import(`./${templateName}/panel-configs.json`)
	const [panels, strings, panelLinks, panelConfigs] = await Promise.all([
		panelsPromise,
		stringsPromise,
		panelLinksPromise,
		panelConfigsPromise,
	])

	const panelJsonFile = z.object({
		panels: z.array(PANEL_MODEL),
	})

	const panelJson = panelJsonFile.parse(panels)

	console.log(panelJson.panels)

	const stringJsonFile = z.object({
		strings: z.array(STRING_MODEL),
	})

	const stringJson = stringJsonFile.parse(strings)

	console.log(stringJson.strings)

	const panelLinkJsonFile = z.object({
		panelLinks: z.array(PANEL_LINK_MODEL).optional(),
	})

	const panelLinkJson = panelLinkJsonFile.parse(panelLinks)

	console.log(panelLinkJson.panelLinks)

	const panelConfigJsonFile = z.object({
		panelConfigs: z.array(PANEL_CONFIG_MODEL),
	})

	const panelConfigJson = panelConfigJsonFile.parse(panelConfigs)

	console.log(panelConfigJson.panelConfigs)

	// console.log(arrRes)
	// const asyncPanels = await import(`./template__12-rows-no-strings/panels.json`)
	// const asyncPanels22 = asyncPanels.values()
	// const asyncPanels2 = Object.entries(asyncPanels)
	// const asyncPanels = await import(`./${templateName}/panels.json`)

	// const panel = asyncPanels22.next()
	// panel.panelConfigs
	console.log(SixRowsOfPanels_Panels.panels)
	console.log(Object.entries(strings))
	console.log(Object.entries(panelLinks))
	console.log(Object.entries(panelConfigs))
	return {
		panels: panelJson.panels as PanelModel[],
		strings: stringJson.strings as StringModel[],
		panelLinks: panelLinkJson.panelLinks as PanelLinkModel[],
		panelConfigs: panelConfigJson.panelConfigs as PanelConfigModel[],
	}
}

export const PROJECT_TEMPLATE_DATA = {
	[PROJECT_TEMPLATE.BLANK.name]: {
		strings: [],
		panels: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TWELVE_ROWS_OF_PANELS_NO_STRING.name]: {
		panels: SixRowsOfPanels_Panels.panels as PanelModel[], // panels: Object.values(SixRowsOfPanels_Panels) as PanelModel[],
		strings: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TWELVE_ROWS_OF_PANELS_SIX_STRINGS.name]: {
		panels: SixRowsOfPanelsInStrings_Panels as PanelModel[],
		strings: SixRowsOfPanelsInStrings_Strings as StringModel[],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TWELVE_ROWS_OF_PANELS_SIX_STRINGS_AND_PANEL_LINKS.name]: {
		panels: SixRowsOfPanelsInStringsAndPanelLinks_Panels as PanelModel[],
		strings: SixRowsOfPanelsInStringsAndPanelLinks_Strings as StringModel[],
		panelLinks: SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks as PanelLinkModel[],
		panelConfigs: [],
	},
} as {
	[templateName in ProjectTemplate['name']]: {
		panels: PanelModel[]
		strings: StringModel[]
		panelLinks: PanelLinkModel[]
		panelConfigs: PanelConfigModel[]
	}
}

// type resultforthis = typeof PROJECT_TEMPLATE_DATA

export const PROJECT_TEMPLATE_DATA_KEYS = Object.keys(
	PROJECT_TEMPLATE_DATA,
) as (keyof typeof PROJECT_TEMPLATE_DATA)[]

export type ProjectTemplateData =
	(typeof PROJECT_TEMPLATE_DATA)[(typeof PROJECT_TEMPLATE_DATA_KEYS)[number]]
