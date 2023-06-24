import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap, tap } from 'rxjs'
import { MessagesActions } from './messages.actions'
import { MessagesSignalrService } from '../../signalr'
import { ProjectsActions } from '@entities/data-access'
import { HttpClient } from '@angular/common/http'
import { WebMessageModel } from '@auth/shared'
import { AuthActions } from '../auth'
import { injectMessagesStore } from './messages.store'
import { ConnectionsActions } from '../connections'

/*export const initializeMessagesHub$ = createEffect(
 (actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
 return actions$.pipe(
 ofType(AuthActions.initializeApp),
 tap(({ token, deviceInfo }) => messagesSignalr.init(token, deviceInfo)),
 )
 },
 { functional: true, dispatch: false },
 )*/
export const addAppMessageToMessagesStore$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			map(({ message }) => {
				const webMessageModel: WebMessageModel = {
					...message,
					isFriend: false,
					isOnline: true,
					lastActiveTime: new Date().toISOString(),
					becameFriendsTime: undefined,
					registeredAtTime: new Date().toISOString(),
				}
				return MessagesActions.addAppMessage({ message: webMessageModel })
			}),
		)
	},
	{ functional: true },
)

export const searchForAppMessages$ = createEffect(
	(actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.searchForAppMessage),
			tap(({ request }) => {
				messagesSignalr.searchForAppMessage(request)
			}),
		)
	},
	{ functional: true, dispatch: false },
)
/*

 export const searchForMessages$ = createEffect(
 (actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
 return actions$.pipe(
 ofType(MessagesActions.searchForAppMessageByMessageName),
 tap(({ query }) => {
 messagesSignalr.searchForAppMessageByMessageName(query)
 }),
 )
 },
 { functional: true, dispatch: false },
 )
 */

export const sendFriendRequest$ = createEffect(
	(actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.sendFriendRequest),
			tap(({ messageId }) => {
				messagesSignalr.sendFriendRequest(messageId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const acceptFriendRequest$ = createEffect(
	(actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.acceptFriendRequest),
			tap(({ messageId }) => {
				messagesSignalr.acceptFriendRequest(messageId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const rejectFriendRequest$ = createEffect(
	(actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.rejectFriendRequest),
			tap(({ messageId }) => {
				messagesSignalr.rejectFriendRequest(messageId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const removeFriend$ = createEffect(
	(actions$ = inject(Actions), messagesSignalr = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.removeFriend),
			tap(({ messageId }) => {
				messagesSignalr.removeFriend(messageId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const fetchWebMessagesForProjectMembers$ = createEffect(
	(
		actions$ = inject(Actions),
		http = inject(HttpClient),
		messagesStore = injectMessagesStore(),
	) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadMessageProjectsSuccess),
			map(({ projects }) => {
				const projectMemberIds = projects.map((project) => project.memberIds).flat()
				const allMessageIds = messagesStore.select.allMessages().map((message) => message.id)
				const appMessageIds = projectMemberIds.filter((id) => !allMessageIds.includes(id))
				return [...new Set(appMessageIds)]
			}),
			switchMap((appMessageIds) => {
				return http
					.post<{
						appMessages: WebMessageModel[]
					}>('/auth/messages', { appMessageIds })
					.pipe(
						tap(({ appMessages }) => {
							console.log('fetchWebMessagesForProjectMembers$ appMessages', appMessages)
						}),
						map(({ appMessages }) => {
							return MessagesActions.addManyMessages({ messages: appMessages })
						}),
					)
			}),
		)
	},
	{ functional: true },
)

export const messageIsOnline$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ConnectionsActions.addConnection),
			map(({ connection }) => {
				const messageId = connection.appMessageId
				return MessagesActions.updateMessage({
					update: {
						id: messageId,
						changes: {
							isOnline: true,
						},
					},
				})
			}),
		)
	},
	{ functional: true },
)

export const messageIsOffline$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ConnectionsActions.deleteConnection),
			map(({ appMessageId }) => {
				return MessagesActions.updateMessage({
					update: {
						id: appMessageId,
						changes: {
							isOnline: false,
						},
					},
				})
			}),
		)
	},
	{ functional: true },
)
