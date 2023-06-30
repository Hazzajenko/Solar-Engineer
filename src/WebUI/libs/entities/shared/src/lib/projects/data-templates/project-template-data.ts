import { PROJECT_TEMPLATE } from '../project-template.model'
import SixRowsOfPanels_Panels from './six-rows-of-panels/panels.json'
import SixRowsOfPanelsInStrings_Panels from './six-rows-of-panels-in-strings/panels.json'
import SixRowsOfPanelsInStrings_Strings from './six-rows-of-panels-in-strings/strings.json'
import SixRowsOfPanelsInStringsAndPanelLinks_Panels from './six-rows-of-panels-in-strings-and-panel-links/panels.json'
import SixRowsOfPanelsInStringsAndPanelLinks_Strings from './six-rows-of-panels-in-strings-and-panel-links/strings.json'
import SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks from './six-rows-of-panels-in-strings-and-panel-links/panel-links.json'

export const PROJECT_TEMPLATE_DATA = {
	[PROJECT_TEMPLATE['BLANK'].name]: {
		strings: [],
		panels: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE['SIX_ROWS_OF_PANELS'].name]: {
		panels: SixRowsOfPanels_Panels,
		strings: [],
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE['SIX_ROWS_OF_PANELS_IN_STRINGS'].name]: {
		panels: SixRowsOfPanelsInStrings_Panels,
		strings: SixRowsOfPanelsInStrings_Strings,
		panelLinks: [],
		panelConfigs: [],
	},
	[PROJECT_TEMPLATE['SIX_ROWS_OF_PANELS_IN_STRINGS_AND_PANEL_LINKS'].name]: {
		panels: SixRowsOfPanelsInStringsAndPanelLinks_Panels,
		strings: SixRowsOfPanelsInStringsAndPanelLinks_Strings,
		panelLinks: SixRowsOfPanelsInStringsAndPanelLinks_PanelLinks,
		panelConfigs: [],
	},
} as const
