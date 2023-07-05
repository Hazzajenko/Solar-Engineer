import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap, tap } from 'rxjs'
import { UsersActions } from './users.actions'
import { UsersSignalrService } from '../../signalr'
import { ProjectsActions } from '@entities/data-access'
import { HttpClient } from '@angular/common/http'
import { WebUserModel } from '@auth/shared'
import { AuthActions } from '../auth'
import { injectUsersStore } from './users.store'
import { ConnectionsActions } from '../connections'

export const addAppUserToUsersStore$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			map(({ user }) => {
				const webUserModel: WebUserModel = {
					...user,
					isFriend: false,
					isOnline: true,
					lastActiveTime: new Date().toISOString(),
					becameFriendsTime: undefined,
					registeredAtTime: new Date().toISOString(),
				}
				return UsersActions.addAppUser({ user: webUserModel })
			}),
		)
	},
	{ functional: true },
)

export const searchForAppUsers$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.searchForAppUser),
			tap(({ request }) => {
				usersSignalr.searchForAppUser(request)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const sendFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.sendFriendRequest),
			tap(({ userId }) => {
				usersSignalr.sendFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const acceptFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.acceptFriendRequest),
			tap(({ userId }) => {
				usersSignalr.acceptFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const rejectFriendRequest$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.rejectFriendRequest),
			tap(({ userId }) => {
				usersSignalr.rejectFriendRequest(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const removeFriend$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.removeFriend),
			tap(({ userId }) => {
				usersSignalr.deleteFriend(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const fetchWebUsersForProjectMembers$ = createEffect(
	(actions$ = inject(Actions), http = inject(HttpClient), usersStore = injectUsersStore()) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadUserProjectsSuccess),
			map(({ projects }) => {
				const projectMemberIds = projects.map((project) => project.memberIds).flat()
				const allUserIds = usersStore.select.allUsers().map((user) => user.id)
				const appUserIds = projectMemberIds.filter((id) => !allUserIds.includes(id))
				return [...new Set(appUserIds)]
			}),
			switchMap((appUserIds) => {
				return http
					.post<{
						appUsers: WebUserModel[]
					}>('/auth/users', { appUserIds })
					.pipe(
						tap(({ appUsers }) => {
							console.log('fetchWebUsersForProjectMembers$ appUsers', appUsers)
						}),
						map(({ appUsers }) => {
							return UsersActions.addManyUsers({ users: appUsers })
						}),
					)
			}),
		)
	},
	{ functional: true },
)

export const userIsOnline$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ConnectionsActions.addConnection),
			map(({ connection }) => {
				const userId = connection.appUserId
				return UsersActions.updateUser({
					update: {
						id: userId,
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

export const userIsOffline$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ConnectionsActions.deleteConnection),
			map(({ appUserId }) => {
				return UsersActions.updateUser({
					update: {
						id: appUserId,
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
