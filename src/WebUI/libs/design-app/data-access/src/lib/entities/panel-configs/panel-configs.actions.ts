import { PanelConfig } from './panel-config'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const PanelConfigsActions = createActionGroup({
	source: 'PanelConfigs Store',
	events: {
		'Add PanelConfig': props<{
			panelConfig: PanelConfig
		}>(),
		'Add Many PanelConfigs': props<{
			panelConfigs: PanelConfig[]
		}>(),
		'Update PanelConfig': props<{
			update: UpdateStr<PanelConfig>
		}>(),
		'Update Many PanelConfigs': props<{
			updates: UpdateStr<PanelConfig>[]
		}>(),
		'Delete PanelConfig': props<{
			panelConfigId: string
		}>(),
		'Delete Many PanelConfigs': props<{
			panelConfigIds: string[]
		}>(),
		'Clear PanelConfigs State': emptyProps(),
	},
})
