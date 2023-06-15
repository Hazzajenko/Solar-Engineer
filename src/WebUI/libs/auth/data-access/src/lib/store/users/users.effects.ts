import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap, tap } from 'rxjs'
import { UsersActions } from './users.actions'
import { UsersSignalrService } from '../../signalr'
import { ProjectsActions } from '@entities/data-access'
import { HttpClient } from '@angular/common/http'
import { WebUserModel } from '@auth/shared'
import { AuthActions } from '../auth'

/*export const initializeUsersHub$ = createEffect(
 (actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
 return actions$.pipe(
 ofType(AuthActions.initializeApp),
 tap(({ token, deviceInfo }) => usersSignalr.init(token, deviceInfo)),
 )
 },
 { functional: true, dispatch: false },
 )*/
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

export const searchForUsers$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.searchForAppUserByUserName),
			tap(({ query }) => {
				usersSignalr.searchForAppUserByUserName(query)
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
				usersSignalr.removeFriend(userId)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const fetchWebUsersForProjectMembers$ = createEffect(
	(actions$ = inject(Actions), http = inject(HttpClient)) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadUserProjectsSuccess),
			map(({ projects }) => {
				const projectMemberIds = projects.map((project) => project.memberIds).flat()
				return [...new Set(projectMemberIds)]
			}),
			switchMap((projectMemberIds) => {
				return http
					.get<{
						appUsers: WebUserModel[]
					}>('/auth/users', { params: { appUserIds: projectMemberIds } })
					.pipe(
						map(({ appUsers }) => {
							return UsersActions.addManyUsers({ users: appUsers })
						}),
					)
			}),
		)
	},
	{ functional: true },
)
