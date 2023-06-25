export interface GroupChatMessageUpdateModel {
	id: number
	changes: GroupChatMessageChanges
}

export interface GroupChatMessageChanges {
	senderInGroup: boolean
}
