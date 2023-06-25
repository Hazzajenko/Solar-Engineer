import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { GroupChatModel } from '@auth/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const GroupChatsActions = createActionGroup({
	source: 'GroupChats Store',
	events: {
		'Load GroupChats': props<{
			groupChats: GroupChatModel[]
		}>(),
		'Add GroupChat': props<{
			groupChat: GroupChatModel
		}>(),
		'Add Many GroupChats': props<{
			groupChats: GroupChatModel[]
		}>(),
		'Update GroupChat': props<{
			update: UpdateStr<GroupChatModel>
		}>(),
		'Update Many GroupChats': props<{
			updates: UpdateStr<GroupChatModel>[]
		}>(),
		'Update Many GroupChats With String': props<{
			updates: EntityUpdate<GroupChatModel>[]
		}>(),
		'Delete GroupChat': props<{
			groupChatId: GroupChatModel['id']
		}>(),
		'Delete Many GroupChats': props<{
			groupChatIds: GroupChatModel['id'][]
		}>(),
		'Add GroupChat No Signalr': props<{
			groupChat: GroupChatModel
		}>(),
		'Add Many GroupChats No Signalr': props<{
			groupChats: GroupChatModel[]
		}>(),
		'Update GroupChat No Signalr': props<{
			update: UpdateStr<GroupChatModel>
		}>(),
		'Update Many GroupChats No Signalr': props<{
			updates: UpdateStr<GroupChatModel>[]
		}>(),
		'Delete GroupChat No Signalr': props<{
			groupChatId: GroupChatModel['id']
		}>(),
		'Delete Many GroupChats No Signalr': props<{
			groupChatIds: GroupChatModel['id'][]
		}>(),
		'Clear GroupChats State': emptyProps(),
		Noop: emptyProps(),
	},
})
