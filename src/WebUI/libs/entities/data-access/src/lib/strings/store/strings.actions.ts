import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel, StringId, StringModel } from '@entities/shared'
import { EntityUpdate } from '@shared/data-access/models'
import { UpdateStr } from '@ngrx/entity/src/models'

export const StringsActions = createActionGroup({
	source: 'Strings Store',
	events: {
		'Load Strings': props<{
			strings: StringModel[]
		}>(),
		'Load New State': props<{
			strings: StringModel[]
		}>(),
		'Load Local Storage Strings': props<{
			strings: StringModel[]
		}>(),
		'Set Undefined String Id': props<{
			stringId: StringId
		}>(),
		'Add String': props<{
			string: StringModel
		}>(),
		'Add String With Panels': props<{
			string: StringModel
			panelUpdates: EntityUpdate<PanelModel>[]
		}>(),
		'Add Many Strings': props<{
			strings: StringModel[]
		}>(),
		'Update String': props<{
			update: EntityUpdate<StringModel>
		}>(),
		'Update Many Strings': props<{
			updates: EntityUpdate<StringModel>[]
		}>(),
		'Delete String': props<{
			stringId: StringId
		}>(),
		'Delete Many Strings': props<{
			stringIds: StringId[]
		}>(),
		'Add String No Signalr': props<{
			string: StringModel
		}>(),
		'Add Many Strings No Signalr': props<{
			strings: StringModel[]
		}>(),
		'Update String No Signalr': props<{
			update: UpdateStr<StringModel>
		}>(),
		'Update Many Strings No Signalr': props<{
			updates: UpdateStr<StringModel>[]
		}>(),
		'Delete String No Signalr': props<{
			stringId: StringId
		}>(),
		'Delete Many Strings No Signalr': props<{
			stringIds: StringId[]
		}>(),
		'Clear Strings State': emptyProps(),
		Noop: emptyProps(),
	},
})
