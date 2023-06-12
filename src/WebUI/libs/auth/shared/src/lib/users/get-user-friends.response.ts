export type GetUserFriendsResponse = {
	friends: FriendModel[]
}

export type FriendModel = {
	id: string
	displayName: string
	photoUrl: string
	userName: string
	becameFriendsTime: string
}
