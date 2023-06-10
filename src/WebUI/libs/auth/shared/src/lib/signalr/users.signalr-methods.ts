export const USERS_SIGNALR_METHOD = {
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
	SEARCH_FOR_APP_USER_BY_USER_NAME: 'SearchForAppUserByUserName',
} as const

export type UsersSignalrMethods = (typeof USERS_SIGNALR_METHOD)[keyof typeof USERS_SIGNALR_METHOD]
