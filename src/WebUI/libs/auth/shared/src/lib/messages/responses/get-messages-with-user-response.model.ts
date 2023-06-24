import { MessageDto } from '../data/message-dto.model'

export interface GetMessagesWithUserResponse {
	userId: string
	messages: MessageDto[]
}
