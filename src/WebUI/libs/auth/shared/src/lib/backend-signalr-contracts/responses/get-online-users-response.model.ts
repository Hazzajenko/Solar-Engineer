import { AppUserConnectionModel } from '../../signalr'

export interface GetOnlineUsersResponse {
	onlineUsers: AppUserConnectionModel[]
}
