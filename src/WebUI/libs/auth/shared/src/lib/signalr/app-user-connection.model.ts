export type AppUserConnectionModel = {
	appUserId: string
	initialConnectedTime: string
	connections: SocketConnectionModel[]
}

export type SocketConnectionModel = {
	connectedTime: string
	connectionId: string
}
