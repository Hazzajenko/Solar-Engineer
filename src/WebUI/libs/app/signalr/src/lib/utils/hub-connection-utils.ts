import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'

export type HubConnectionRequest = {
	token: string
	hubName: string
	hubUrl: string
}
export const createHubConnection = (request: HubConnectionRequest, logger: signalR.ILogger) => {
	const { token, hubName, hubUrl } = request
	const hubConnection = new HubConnectionBuilder()
		.withUrl(hubUrl, {
			accessTokenFactory: () => token,
			skipNegotiation: true,
			transport: signalR.HttpTransportType.WebSockets,
		})
		.configureLogging(logger)
		.withAutomaticReconnect()
		.build()
	hubConnection
		.start()
		.then(() => {
			console.log(hubName + ' Hub Connection started')
		})
		.catch((err) => {
			console.error('Error while starting ' + hubName + ' Hub connection: ' + err)
			throw err
		})
	return hubConnection
}

export const invokeHubConnection = (
	hubConnection: HubConnection,
	invoke: string,
	params?: unknown,
) => {
	if (invoke && params)
		hubConnection.invoke(invoke, params).catch((err) => console.error(err, invoke, params))
	if (invoke && !params) {
		hubConnection.invoke(invoke).catch((err) => console.error(err, invoke))
	}
}
