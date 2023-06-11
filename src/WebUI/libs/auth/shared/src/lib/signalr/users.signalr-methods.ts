export const USERS_SIGNALR_METHOD = {
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
	SEARCH_FOR_APP_USER_BY_USER_NAME: 'SearchForAppUserByUserName',
	SEND_FRIEND_REQUEST: 'SendFriendRequest',
	ACCEPT_FRIEND_REQUEST: 'AcceptFriendRequest',
	REJECT_FRIEND_REQUEST: 'RejectFriendRequest',
	GET_NOTIFICATIONS: 'GetNotifications',
	READ_NOTIFICATION: 'ReadNotification',
	DELETE_NOTIFICATION: 'DeleteNotification',
} as const

export type UsersSignalrMethods = (typeof USERS_SIGNALR_METHOD)[keyof typeof USERS_SIGNALR_METHOD]
