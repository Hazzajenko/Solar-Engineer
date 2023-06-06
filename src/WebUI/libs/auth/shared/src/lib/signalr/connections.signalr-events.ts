export const CONNECTIONS_SIGNALR_EVENT = {
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	GET_ONLINE_USERS: 'GetOnlineUsers',
} as const

export type ConnectionsSignalrEvents =
	(typeof CONNECTIONS_SIGNALR_EVENT)[keyof typeof CONNECTIONS_SIGNALR_EVENT]
