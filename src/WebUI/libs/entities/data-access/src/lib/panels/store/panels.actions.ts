import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel } from '@entities/shared'

export const PanelsActions = createActionGroup({
	source: 'Panels Store',
	events: {
		'Add Panel': props<{
			panel: PanelModel
		}>(),
		'Add Many Panels': props<{
			panels: PanelModel[]
		}>(),
		'Update Panel': props<{
			update: UpdateStr<PanelModel>
		}>(),
		'Update Many Panels': props<{
			updates: UpdateStr<PanelModel>[]
		}>(),
		'Delete Panel': props<{
			panelId: string
		}>(),
		'Delete Many Panels': props<{
			panelIds: string[]
		}>(),
		'Clear Panels State': emptyProps(),
	},
})
