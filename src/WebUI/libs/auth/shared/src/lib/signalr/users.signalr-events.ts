export const USERS_SIGNALR_EVENT = {
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	GET_ONLINE_USERS: 'GetOnlineUsers',
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
	RECEIVE_SEARCH_FOR_APP_USER_BY_USER_NAME_RESPONSE: 'ReceiveSearchForAppUserByUserNameResponse',
	RECEIVE_FRIEND_REQUEST_EVENT: 'ReceiveFriendRequestEvent',
	NOTIFICATION_UPDATED: 'NotificationUpdated',
	RECEIVE_NOTIFICATION: 'ReceiveNotification',
} as const

export type UsersSignalrEvents = (typeof USERS_SIGNALR_EVENT)[keyof typeof USERS_SIGNALR_EVENT]
