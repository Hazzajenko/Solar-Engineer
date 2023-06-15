import { z } from 'zod'

export type WebUserModel = {
	id: string
	userName: string
	displayName: string
	photoUrl: string
	isFriend: boolean
	becameFriendsTime: string | undefined
	isOnline: boolean
	lastActiveTime: string
	registeredAtTime: string
}

export const WEB_USER_MODEL = z.object({
	id: z.string(),
	userName: z.string(),
	displayName: z.string(),
	photoUrl: z.string(),
	isFriend: z.boolean(),
	becameFriendsTime: z.string(),
	isOnline: z.boolean(),
	lastActiveTime: z.string(),
	registeredAtTime: z.string(),
})

export const isWebUser = (user: WebUserModel): WebUserModel => {
	return WEB_USER_MODEL.parse(user)
}

export type MinimalWebUser = Pick<WebUserModel, 'id' | 'userName' | 'displayName' | 'photoUrl'>

export const minimalToWebUser = (user: MinimalWebUser): WebUserModel => {
	return {
		...user,
		isFriend: false,
		isOnline: false,
		lastActiveTime: new Date().toISOString(),
	} as WebUserModel
}

export const WEB_USER_STATE_COLOUR = {
	OFFLINE: 'gray',
	ONLINE: 'green',
	AWAY: 'orange',
	BUSY: 'red',
}
