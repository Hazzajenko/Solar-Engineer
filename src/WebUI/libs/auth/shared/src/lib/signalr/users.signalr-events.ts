export const USERS_SIGNALR_EVENT = {
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	GET_ONLINE_USERS: 'GetOnlineUsers',
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
} as const

export type UsersSignalrEvents = (typeof USERS_SIGNALR_EVENT)[keyof typeof USERS_SIGNALR_EVENT]
