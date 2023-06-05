import { PanelConfigModel } from '@entities/shared'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const PanelConfigsActions = createActionGroup({
	source: 'PanelConfigs Store',
	events: {
		'Load PanelConfigs': props<{
			panelConfigs: PanelConfigModel[]
		}>(),
		'Add PanelConfig': props<{
			panelConfig: PanelConfigModel
		}>(),
		'Add Many PanelConfigs': props<{
			panelConfigs: PanelConfigModel[]
		}>(),
		'Update PanelConfig': props<{
			update: UpdateStr<PanelConfigModel>
		}>(),
		'Update Many PanelConfigs': props<{
			updates: UpdateStr<PanelConfigModel>[]
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
