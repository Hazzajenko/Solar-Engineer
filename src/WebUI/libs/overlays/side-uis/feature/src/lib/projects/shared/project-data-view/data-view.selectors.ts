import { createSelector } from '@ngrx/store'
import {
	selectAllPanelLinksGroupedByStringId,
	selectAllPanelsGroupedByStringId,
	selectPanelConfigsEntities,
	selectStringsEntities,
} from '@entities/data-access'
import { Dictionary } from '@ngrx/entity'
import {
	PanelConfigModel,
	PanelLinkModel,
	PanelModel,
	StringId,
	StringModel,
	StringWithPanelsAndStats,
} from '@entities/shared'
import { assertNotNull } from '@shared/utils'
import { calculateStringStatsForSelectedString, mapPanelToPanelWithConfig } from '@entities/utils'

export const selectPanelsGroupedWithStringsAndStats = createSelector(
	selectStringsEntities,
	selectPanelConfigsEntities,
	selectAllPanelsGroupedByStringId,
	selectAllPanelLinksGroupedByStringId,
	(
		strings: Dictionary<StringModel>,
		panelConfigs: Dictionary<PanelConfigModel>,
		panelsGroupedByStringId: Record<StringId, PanelModel[]>,
		panelLinksGroupedByStringId: Record<StringId, PanelLinkModel[]>,
	) => {
		const entries = Object.entries(panelsGroupedByStringId)
		return entries.map(([stringId, stringPanels]) => {
			const string = strings[stringId]
			assertNotNull(string)
			const panelLinksForString = panelLinksGroupedByStringId[string.id] ?? []
			const panelsWithSpecs = stringPanels.map((panel) => {
				const panelConfig = panelConfigs[panel.panelConfigId]
				assertNotNull(panelConfig)
				return mapPanelToPanelWithConfig(panel, panelConfig)
			})
			const stats = calculateStringStatsForSelectedString(
				stringPanels,
				panelLinksForString,
				panelsWithSpecs,
			)
			return {
				string,
				panels: stringPanels,
				stats,
			} as StringWithPanelsAndStats
		})
	},
)
