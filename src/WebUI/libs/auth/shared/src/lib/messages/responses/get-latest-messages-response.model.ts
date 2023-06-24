import { LatestUserMessageDto } from '../data/latest-user-message-dto.model'

export interface GetLatestMessagesResponse {
	messages: LatestUserMessageDto[]
}
