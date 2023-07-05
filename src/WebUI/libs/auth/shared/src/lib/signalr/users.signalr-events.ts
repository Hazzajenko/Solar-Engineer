export const USERS_SIGNALR_EVENT = {
	APP_USER_IS_CONNECTED: 'AppUserIsConnected',
	USER_IS_ONLINE: 'UserIsOnline',
	USER_IS_OFFLINE: 'UserIsOffline',
	GET_ONLINE_USERS: 'GetOnlineUsers',
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
	GET_USER_FRIENDS: 'GetUserFriends',
	RECEIVE_FRIEND: 'ReceiveFriend',
	RECEIVE_SEARCH_FOR_APP_USER_BY_USER_NAME_RESPONSE: 'ReceiveSearchForAppUserByUserNameResponse',
	RECEIVE_FRIEND_REQUEST_EVENT: 'ReceiveFriendRequestEvent',
	FRIEND_REMOVED: 'FriendRemoved',
	NOTIFICATION_UPDATED: 'NotificationUpdated',
	RECEIVE_NOTIFICATION: 'ReceiveNotification',
	UPDATE_NOTIFICATION: 'UpdateNotification',
	RECEIVE_APP_USER_NOTIFICATIONS: 'ReceiveAppUserNotifications',
	RECEIVE_SEARCH_RESULTS_FOR_APP_USER: 'ReceiveSearchResultsForAppUser',
} as const

export type UsersSignalrEvent = (typeof USERS_SIGNALR_EVENT)[keyof typeof USERS_SIGNALR_EVENT]
