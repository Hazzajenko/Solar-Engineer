import { FriendModel, WebUserModel } from '@auth/shared'

export const friendToWebUser = (friend: FriendModel): WebUserModel => {
	return {
		...friend,
		isFriend: true,
		lastActiveTime: new Date().toISOString(),
		isOnline: false,
	} as WebUserModel
}
