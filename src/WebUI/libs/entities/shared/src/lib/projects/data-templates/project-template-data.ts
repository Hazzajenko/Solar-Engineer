import { PROJECT_TEMPLATE, ProjectTemplate } from '../project-template.model'
import SixRowsOfPanels_Panels from './template__12-rows-no-strings/panels.json'
import SixRowsOfPanelsInStrings_Panels from './template__12-rows-6-strings/panels.json'
import SixRowsOfPanelsInStrings_Strings from './template__12-rows-6-strings/strings.json'
import SixRowsOfPanelsInStringsAndPanelLinks_Panels from './template__12-rows-6-strings-with-links/panels.json'
import SixRowsOfPanelsInStringsAndPanelLinks_Strings from './template__12-rows-6-strings-with-links/strings.json'
import SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks from './template__12-rows-6-strings-with-links/panel-links.json'
import { PANEL_MODEL, PanelModel } from '../../panels'
import { STRING_MODEL, StringModel } from '../../strings'
import { PANEL_LINK_MODEL, PanelLinkModel } from '../../panel-links'
import { PANEL_CONFIG_MODEL, PanelConfigModel } from '../../panel-configs'
import { z } from 'zod'

export const fetchProjectTemplateData = async (templateName: ProjectTemplate['templateName']) => {
	const panelsPromise = import(`./${templateName}/panels.json`)
	const stringsPromise = import(`./${templateName}/strings.json`)
	const panelLinksPromise = import(`./${templateName}/panel-links.json`)
	const panelConfigsPromise = import(`./${templateName}/panel-configs.json`)
	const [panelsJson, stringsJson, panelLinksJson, panelConfigsJson] = await Promise.all([
		panelsPromise,
		stringsPromise,
		panelLinksPromise,
		panelConfigsPromise,
	])

	const panels = parsePanelFile(panelsJson)
	const strings = parseStringFile(stringsJson)
	const panelLinks = parsePanelLinkFile(panelLinksJson)
	const panelConfigs = parsePanelConfigFile(panelConfigsJson)

	return {
		panels,
		strings,
		panelLinks,
		panelConfigs,
	}
}

const parsePanelFile = (panels: unknown) => {
	const panelJsonFile = z.object({
		panels: z.array(PANEL_MODEL),
	})

	return panelJsonFile.parse(panels).panels as PanelModel[]
}

const parseStringFile = (strings: unknown) => {
	const stringJsonFile = z.object({
		strings: z.array(STRING_MODEL),
	})

	return stringJsonFile.parse(strings).strings as StringModel[]
}

const parsePanelLinkFile = (panelLinks: unknown) => {
	const panelLinkJsonFile = z.object({
		panelLinks: z.array(PANEL_LINK_MODEL),
	})

	return panelLinkJsonFile.parse(panelLinks).panelLinks as PanelLinkModel[]
}

const parsePanelConfigFile = (panelConfigs: unknown) => {
	const panelConfigJsonFile = z.object({
		panelConfigs: z.array(PANEL_CONFIG_MODEL),
	})

	return panelConfigJsonFile.parse(panelConfigs).panelConfigs as PanelConfigModel[]
}

export const PROJECT_TEMPLATE_DATA = {
	[PROJECT_TEMPLATE.Blank.name]: {
		strings: [],
		panels: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TwelveRowsNoStrings.name]: {
		panels: SixRowsOfPanels_Panels.panels as PanelModel[], // panels: Object.values(SixRowsOfPanels_Panels) as PanelModel[],
		strings: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TwelveRowsSixStrings.name]: {
		panels: SixRowsOfPanelsInStrings_Panels.panels as PanelModel[],
		strings: SixRowsOfPanelsInStrings_Strings.strings as StringModel[],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE.TwelveRowsSixStringsWithLinks.name]: {
		panels: SixRowsOfPanelsInStringsAndPanelLinks_Panels.panels as PanelModel[],
		strings: SixRowsOfPanelsInStringsAndPanelLinks_Strings.strings as StringModel[],
		panelLinks: SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks.panelLinks as PanelLinkModel[],
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
