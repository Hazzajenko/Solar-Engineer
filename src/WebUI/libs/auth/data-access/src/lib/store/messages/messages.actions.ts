import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	FriendRequestResponse,
	MinimalWebMessage,
	SearchForAppMessageRequest,
	SearchForAppMessageResponse,
	WebMessageModel,
} from '@auth/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const MessagesActions = createActionGroup({
	source: 'Messages Store',
	events: {
		'Get Online Friends': emptyProps(),
		'Receive Friend Request Event': props<{
			response: FriendRequestResponse
		}>(),
		'Send Friend Request': props<{
			messageId: string
		}>(),
		'Accept Friend Request': props<{
			messageId: string
		}>(),
		'Reject Friend Request': props<{
			messageId: string
		}>(),
		'Remove Friend': props<{
			messageId: string
		}>(),
		'Search For App Message By Message Name': props<{
			query: string
		}>(),
		'Search For App Message': props<{
			request: SearchForAppMessageRequest
		}>(),
		'Receive Messages From Search': props<{
			messages: MinimalWebMessage[]
		}>(),
		'Receive Search Results For App Message': props<{
			response: SearchForAppMessageResponse
		}>(),
		'Clear App Message Search Results': emptyProps(),
		'Clear Message Search Results': emptyProps(),
		'Load Messages': props<{
			messages: WebMessageModel[]
		}>(),
		'Add App Message': props<{
			message: WebMessageModel
		}>(),
		'Add Message': props<{
			message: WebMessageModel
		}>(),
		'Add Many Messages': props<{
			messages: WebMessageModel[]
		}>(),
		'Update Message': props<{
			update: UpdateStr<WebMessageModel>
		}>(),
		'Update Many Messages': props<{
			updates: UpdateStr<WebMessageModel>[]
		}>(),
		'Update Many Messages With String': props<{
			updates: EntityUpdate<WebMessageModel>[]
		}>(),
		'Delete Message': props<{
			messageId: WebMessageModel['id']
		}>(),
		'Delete Many Messages': props<{
			messageIds: WebMessageModel['id'][]
		}>(),
		'Add Message No Signalr': props<{
			message: WebMessageModel
		}>(),
		'Add Many Messages No Signalr': props<{
			messages: WebMessageModel[]
		}>(),
		'Update Message No Signalr': props<{
			update: UpdateStr<WebMessageModel>
		}>(),
		'Update Many Messages No Signalr': props<{
			updates: UpdateStr<WebMessageModel>[]
		}>(),
		'Delete Message No Signalr': props<{
			messageId: WebMessageModel['id']
		}>(),
		'Delete Many Messages No Signalr': props<{
			messageIds: WebMessageModel['id'][]
		}>(),
		'Clear Messages State': emptyProps(),
		Noop: emptyProps(),
	},
})
