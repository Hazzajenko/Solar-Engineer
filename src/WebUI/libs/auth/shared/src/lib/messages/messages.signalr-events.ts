export const MESSAGES_SIGNALR_EVENT = {
	RECEIVE_MESSAGE: 'ReceiveMessage',
	GET_MESSAGES_WITH_USER: 'GetMessagesWithUser',
	GET_LATEST_MESSAGES: 'GetLatestMessages',
	GET_LATEST_USER_MESSAGES: 'GetLatestUserMessages',
	GET_LATEST_GROUP_CHAT_MESSAGES: 'GetLatestGroupChatMessages',
	GET_GROUP_CHAT_MESSAGES: 'GetGroupChatMessages',
	GROUP_CHAT_MEMBERS_ADDED: 'GroupChatMembersAdded',
	GROUP_CHAT_MEMBERS_REMOVED: 'GroupChatMembersRemoved',
} as const

export type MessagesSignalrEvent =
	(typeof MESSAGES_SIGNALR_EVENT)[keyof typeof MESSAGES_SIGNALR_EVENT]
