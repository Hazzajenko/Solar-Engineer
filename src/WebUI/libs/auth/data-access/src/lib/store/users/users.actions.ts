import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	FriendRequestResponse,
	MinimalWebUser,
	SearchForAppUserRequest,
	SearchForAppUserResponse,
	WebUserModel,
} from '@auth/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const UsersActions = createActionGroup({
	source: 'Users Store',
	events: {
		'Get Online Friends': emptyProps(),
		'Receive Friend Request Event': props<{
			response: FriendRequestResponse
		}>(),
		'Receive Friend': props<{
			friend: WebUserModel
		}>(),
		'Send Friend Request': props<{
			userId: string
		}>(),
		'Accept Friend Request': props<{
			userId: string
		}>(),
		'Reject Friend Request': props<{
			userId: string
		}>(),
		'Remove Friend': props<{
			userId: string
		}>(),
		'Search For App User By User Name': props<{
			query: string
		}>(),
		'Search For App User': props<{
			request: SearchForAppUserRequest
		}>(),
		'Receive Users From Search': props<{
			users: MinimalWebUser[]
		}>(),
		'Receive Search Results For App User': props<{
			response: SearchForAppUserResponse
		}>(),
		'Clear App User Search Results': emptyProps(),
		'Clear User Search Results': emptyProps(),
		'Load Users': props<{
			users: WebUserModel[]
		}>(),
		'Add App User': props<{
			user: WebUserModel
		}>(),
		'Add User': props<{
			user: WebUserModel
		}>(),
		'Add Many Users': props<{
			users: WebUserModel[]
		}>(),
		'Update User': props<{
			update: UpdateStr<WebUserModel>
		}>(),
		'Update Many Users': props<{
			updates: UpdateStr<WebUserModel>[]
		}>(),
		'Update Many Users With String': props<{
			updates: EntityUpdate<WebUserModel>[]
		}>(),
		'Delete User': props<{
			userId: WebUserModel['id']
		}>(),
		'Delete Many Users': props<{
			userIds: WebUserModel['id'][]
		}>(),
		'Add User No Signalr': props<{
			user: WebUserModel
		}>(),
		'Add Many Users No Signalr': props<{
			users: WebUserModel[]
		}>(),
		'Update User No Signalr': props<{
			update: UpdateStr<WebUserModel>
		}>(),
		'Update Many Users No Signalr': props<{
			updates: UpdateStr<WebUserModel>[]
		}>(),
		'Delete User No Signalr': props<{
			userId: WebUserModel['id']
		}>(),
		'Delete Many Users No Signalr': props<{
			userIds: WebUserModel['id'][]
		}>(),
		'Clear Users State': emptyProps(),
		Noop: emptyProps(),
	},
})
