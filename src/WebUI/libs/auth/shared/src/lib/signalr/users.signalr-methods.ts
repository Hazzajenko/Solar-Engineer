export const USERS_SIGNALR_METHOD = {
	GET_ONLINE_FRIENDS: 'GetOnlineFriends',
} as const

export type UsersSignalrMethods = (typeof USERS_SIGNALR_METHOD)[keyof typeof USERS_SIGNALR_METHOD]
