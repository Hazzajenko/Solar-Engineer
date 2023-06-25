import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatMessageModel } from '@auth/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const GroupChatMessagesActions = createActionGroup({
	source: 'GroupChatMessages Store',
	events: {
		'Load GroupChatMessages': props<{
			groupChatMessages: GroupChatMessageModel[]
		}>(),
		'Add GroupChatMessage': props<{
			groupChatMessage: GroupChatMessageModel
		}>(),
		'Add Many GroupChatMessages': props<{
			groupChatMessages: GroupChatMessageModel[]
		}>(),
		'Update GroupChatMessage': props<{
			update: UpdateStr<GroupChatMessageModel>
		}>(),
		'Update Many GroupChatMessages': props<{
			updates: UpdateStr<GroupChatMessageModel>[]
		}>(),
		'Update Many GroupChatMessages With String': props<{
			updates: EntityUpdate<GroupChatMessageModel>[]
		}>(),
		'Delete GroupChatMessage': props<{
			groupChatMessageId: GroupChatMessageModel['id']
		}>(),
		'Delete Many GroupChatMessages': props<{
			groupChatMessageIds: GroupChatMessageModel['id'][]
		}>(),
		'Add GroupChatMessage No Signalr': props<{
			groupChatMessage: GroupChatMessageModel
		}>(),
		'Add Many GroupChatMessages No Signalr': props<{
			groupChatMessages: GroupChatMessageModel[]
		}>(),
		'Update GroupChatMessage No Signalr': props<{
			update: UpdateStr<GroupChatMessageModel>
		}>(),
		'Update Many GroupChatMessages No Signalr': props<{
			updates: UpdateStr<GroupChatMessageModel>[]
		}>(),
		'Delete GroupChatMessage No Signalr': props<{
			groupChatMessageId: GroupChatMessageModel['id']
		}>(),
		'Delete Many GroupChatMessages No Signalr': props<{
			groupChatMessageIds: GroupChatMessageModel['id'][]
		}>(),
		'Clear GroupChatMessages State': emptyProps(),
		Noop: emptyProps(),
	},
})
