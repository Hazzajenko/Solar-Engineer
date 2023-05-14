import { injectPanelsFeature } from '@entities/panels/data-access'
import { injectStringsFeature } from '@entities/strings/data-access'
import { injectPanelConfigsFeature } from '@entities/panel-configs/data-access'
import { injectPanelLinksFeature } from '@entities/panel-links/data-access'

export function injectEntityStore() {
	const panels = injectPanelsFeature()
	const panelConfigs = injectPanelConfigsFeature()
	const panelLinks = injectPanelLinksFeature()
	const strings = injectStringsFeature()
	return {
		panels,
		panelConfigs,
		panelLinks,
		strings,
	}
}

export type EntityStore = ReturnType<typeof injectEntityStore>
