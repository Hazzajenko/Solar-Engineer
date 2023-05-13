import { CanvasPanel } from '../types'
import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const PanelsActions = createActionGroup({
	source: 'Panels Store',
	events: {
		'Add Panel': props<{
			panel: CanvasPanel
		}>(),
		'Add Many Panels': props<{
			panels: CanvasPanel[]
		}>(),
		'Update Panel': props<{
			update: UpdateStr<CanvasPanel>
		}>(),
		'Update Many Panels': props<{
			updates: UpdateStr<CanvasPanel>[]
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
