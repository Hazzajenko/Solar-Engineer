/*export enum MessageFrom {
 Unknown,
 OtherUser,
 CurrentUser,
 Server,
 }*/

export const MESSAGE_FROM = {
	UNKNOWN: 'Unknown',
	OTHER_USER: 'OtherUser',
	CURRENT_USER: 'CurrentUser',
	SERVER: 'Server',
} as const

export type MessageFrom = (typeof MESSAGE_FROM)[keyof typeof MESSAGE_FROM]
