import {
	PanelConfigsActions,
	PanelLinksActions,
	PanelsActions,
	StringsActions,
} from '@entities/data-access'

export type ProjectLocalStorageAction =
	| ReturnType<typeof PanelsActions.addPanel>
	| ReturnType<typeof PanelsActions.updatePanel>
	| ReturnType<typeof PanelsActions.deletePanel>
	| ReturnType<typeof PanelsActions.addManyPanels>
	| ReturnType<typeof PanelsActions.updateManyPanels>
	| ReturnType<typeof PanelsActions.deleteManyPanels>
	| ReturnType<typeof PanelsActions.updateManyPanelsWithString>
	| ReturnType<typeof StringsActions.addString>
	| ReturnType<typeof StringsActions.updateString>
	| ReturnType<typeof StringsActions.deleteString>
	| ReturnType<typeof StringsActions.addManyStrings>
	| ReturnType<typeof StringsActions.addStringWithPanels>
	| ReturnType<typeof StringsActions.updateManyStrings>
	| ReturnType<typeof StringsActions.deleteManyStrings>
	| ReturnType<typeof PanelLinksActions.addPanelLink>
	| ReturnType<typeof PanelLinksActions.updatePanelLink>
	| ReturnType<typeof PanelLinksActions.deletePanelLink>
	| ReturnType<typeof PanelLinksActions.addManyPanelLinks>
	| ReturnType<typeof PanelLinksActions.updateManyPanelLinks>
	| ReturnType<typeof PanelLinksActions.deleteManyPanelLinks>
	| ReturnType<typeof PanelConfigsActions.addPanelConfig>
	| ReturnType<typeof PanelConfigsActions.updatePanelConfig>
	| ReturnType<typeof PanelConfigsActions.deletePanelConfig>
	| ReturnType<typeof PanelConfigsActions.addManyPanelConfigs>
	| ReturnType<typeof PanelConfigsActions.updateManyPanelConfigs>
	| ReturnType<typeof PanelConfigsActions.deleteManyPanelConfigs>
