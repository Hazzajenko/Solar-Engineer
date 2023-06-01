import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

export type HubConnectionRequest = {
	token: string
	hubName: string
	hubUrl: string
	invoke?: string
	params?: unknown[]
}
export const createHubConnection = (request: HubConnectionRequest) => {
	const { token, hubName, hubUrl, invoke, params } = request
	const hubConnection = new HubConnectionBuilder()
		.withUrl(hubUrl, {
			accessTokenFactory: () => token,
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets,
		})
		.configureLogging(LogLevel.Information)
		.withAutomaticReconnect()
		.build()
	hubConnection
		.start()
		.then(() => {
			console.log(hubName + ' Hub Connection started')
			if (invoke) {
				invokeHubConnection(hubConnection, invoke, params)
			}
		})
		.catch((err) => {
			console.error('Error while starting ' + hubName + ' Hub connection: ' + err)
		})
	return hubConnection
}

export const invokeHubConnection = (
	hubConnection: HubConnection,
	invoke: string,
	params?: unknown[],
) => {
	if (invoke && params)
		hubConnection.invoke(invoke, params).catch((err) => console.error(err, invoke, params))
	if (invoke && !params) {
		hubConnection.invoke(invoke).catch((err) => console.error(err, invoke))
	}
}
