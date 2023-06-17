import { Dictionary } from '@ngrx/entity'
import { PanelModel, StringModel, StringWithPanels } from '@entities/shared'
import { isNotNull } from '@shared/utils'

export const panelsGroupedByStringIdMappedToStringWithPanels = (
	panelsGroupedByStringId: Dictionary<PanelModel[]>,
	strings: Dictionary<StringModel>,
) => {
	const entries = Object.entries(panelsGroupedByStringId)
	const group = entries.map(([stringId, panels]) => {
		const string = strings[stringId]
		if (!string || !panels) return undefined
		return {
			string,
			panels,
		}
	})
	if (!group) return [] as StringWithPanels[]
	return group.filter(isNotNull) as StringWithPanels[]
}
