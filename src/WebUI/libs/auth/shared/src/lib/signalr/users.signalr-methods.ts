export const USERS_SIGNALR_METHOD = {
	SEND_DEVICE_INFO: 'SendDeviceInfo',
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
	SEARCH_FOR_APP_USER_BY_USER_NAME: 'SearchForAppUserByUserName',
	SEND_FRIEND_REQUEST: 'SendFriendRequest',
	ACCEPT_FRIEND_REQUEST: 'AcceptFriendRequest',
	REJECT_FRIEND_REQUEST: 'RejectFriendRequest',
	DELETE_FRIEND: 'DeleteFriend',
	GET_NOTIFICATIONS: 'GetNotifications', // READ_NOTIFICATION: 'ReadNotification',
	READ_MANY_NOTIFICATIONS: 'ReadManyNotifications',
	COMPLETE_MANY_NOTIFICATIONS: 'CompleteManyNotifications',
	DELETE_NOTIFICATION: 'DeleteNotification',
	RECEIVE_NOTIFICATION: 'ReceiveNotification',
	SEARCH_FOR_APP_USER: 'SearchForAppUser',
} as const

export type UsersSignalrMethods = (typeof USERS_SIGNALR_METHOD)[keyof typeof USERS_SIGNALR_METHOD]
