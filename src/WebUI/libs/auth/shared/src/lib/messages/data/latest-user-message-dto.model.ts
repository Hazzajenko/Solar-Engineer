import { MessageDto } from './message-dto.model'

export interface LatestUserMessageDto {
	userId: string
	message: MessageDto | null
}
