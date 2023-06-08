import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelId, PanelModel } from '@entities/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const PanelsActions = createActionGroup({
	source: 'Panels Store',
	events: {
		'Load Panels': props<{
			panels: PanelModel[]
		}>(),
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
		'Update Many Panels With String': props<{
			updates: EntityUpdate<PanelModel>[]
		}>(),
		'Delete Panel': props<{
			panelId: PanelId
		}>(),
		'Delete Many Panels': props<{
			panelIds: PanelId[]
		}>(),
		'Add Panel No Signalr': props<{
			panel: PanelModel
		}>(),
		'Add Many Panels No Signalr': props<{
			panels: PanelModel[]
		}>(),
		'Update Panel No Signalr': props<{
			update: UpdateStr<PanelModel>
		}>(),
		'Update Many Panels No Signalr': props<{
			updates: UpdateStr<PanelModel>[]
		}>(),
		'Delete Panel No Signalr': props<{
			panelId: PanelId
		}>(),
		'Delete Many Panels No Signalr': props<{
			panelIds: PanelId[]
		}>(),
		'Clear Panels State': emptyProps(),
		Noop: emptyProps(),
	},
})
