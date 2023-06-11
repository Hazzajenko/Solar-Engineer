export type WebUserModel = {
	id: string
	userName: string
	displayName: string
	photoUrl: string
	isFriend: boolean
	isOnline: boolean
	lastSeen: Date
}

export type MinimalWebUser = Pick<WebUserModel, 'id' | 'userName' | 'displayName' | 'photoUrl'>

export const WEB_USER_STATE_COLOUR = {
	OFFLINE: 'gray',
	ONLINE: 'green',
	AWAY: 'orange',
	BUSY: 'red',
}
