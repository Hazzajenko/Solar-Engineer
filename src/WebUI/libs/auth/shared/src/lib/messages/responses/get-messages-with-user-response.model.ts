import { MessageModel } from '../data'

export interface GetMessagesWithUserResponse {
	userId: string
	messages: MessageModel[]
}
