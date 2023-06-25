import { MessageModel } from './message.model'

export interface LatestUserMessageModel {
	userId: string
	message: MessageModel | null
}
