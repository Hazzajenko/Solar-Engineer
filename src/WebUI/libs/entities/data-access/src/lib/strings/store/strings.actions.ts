import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelModel, StringId, StringModel } from '@entities/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const StringsActions = createActionGroup({
	source: 'Strings Store',
	events: {
		'Load Strings': props<{
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
			update: UpdateStr<StringModel>
		}>(),
		'Update Many Strings': props<{
			updates: UpdateStr<StringModel>[]
		}>(),
		'Delete String': props<{
			stringId: StringId
		}>(),
		'Delete Many Strings': props<{
			stringIds: StringId[]
		}>(),
		'Clear Strings State': emptyProps(),
		Noop: emptyProps(),
	},
})
