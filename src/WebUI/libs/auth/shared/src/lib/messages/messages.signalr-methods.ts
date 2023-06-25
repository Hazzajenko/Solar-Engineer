export const MESSAGES_SIGNALR_METHOD = {
	REMOVE_USERS_FROM_GROUP_CHAT: 'RemoveUsersFromGroupChat',
	INVITE_USERS_TO_GROUP_CHAT: 'InviteUsersToGroupChat',
	GET_MESSAGES_WITH_USER: 'GetMessagesWithUser',
	GET_GROUP_CHAT_MESSAGES: 'GetGroupChatMessages',
	SEND_MESSAGE_TO_USER: 'SendMessageToUser',
	SEND_MESSAGE_TO_GROUP_CHAT: 'SendMessageToGroupChat',
} as const

export type MessagesSignalrMethods =
	(typeof MESSAGES_SIGNALR_METHOD)[keyof typeof MESSAGES_SIGNALR_METHOD]
