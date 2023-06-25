import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	GetMessagesWithUserRequest,
	MessageModel,
	MessagePreviewModel,
	SendMessageRequest,
} from '@auth/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const MessagesActions = createActionGroup({
	source: 'Messages Store',
	events: {
		'Load Messages': props<{
			messages: MessageModel[]
		}>(),
		'Load Latest Messages': props<{
			messages: MessagePreviewModel[]
		}>(),
		'Fetch Messages By User Id': props<{
			request: GetMessagesWithUserRequest
		}>(),
		'Send Message To User': props<{
			request: SendMessageRequest
		}>(),
		'Add Message': props<{
			message: MessageModel
		}>(),
		'Add Many Messages': props<{
			messages: MessageModel[]
		}>(),
		'Update Message': props<{
			update: UpdateStr<MessageModel>
		}>(),
		'Update Many Messages': props<{
			updates: UpdateStr<MessageModel>[]
		}>(),
		'Update Many Messages With String': props<{
			updates: EntityUpdate<MessageModel>[]
		}>(),
		'Delete Message': props<{
			messageId: MessageModel['id']
		}>(),
		'Delete Many Messages': props<{
			messageIds: MessageModel['id'][]
		}>(),
		'Add Message No Signalr': props<{
			message: MessageModel
		}>(),
		'Add Many Messages No Signalr': props<{
			messages: MessageModel[]
		}>(),
		'Update Message No Signalr': props<{
			update: UpdateStr<MessageModel>
		}>(),
		'Update Many Messages No Signalr': props<{
			updates: UpdateStr<MessageModel>[]
		}>(),
		'Delete Message No Signalr': props<{
			messageId: MessageModel['id']
		}>(),
		'Delete Many Messages No Signalr': props<{
			messageIds: MessageModel['id'][]
		}>(),
		'Clear Messages State': emptyProps(),
		Noop: emptyProps(),
	},
})
