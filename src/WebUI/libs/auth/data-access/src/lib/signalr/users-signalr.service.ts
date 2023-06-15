import { Injectable } from '@angular/core'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import { ConnectionModel, FriendModel, FriendRequestResponse, GetOnlineFriendsResponse, GetUserFriendsResponse, NotificationModel, ReceiveAppUserNotificationsResponse, SearchForUserResponse, UpdateNotificationResponse, USERS_SIGNALR_EVENT, USERS_SIGNALR_METHOD, UsersSignalrEvent } from '@auth/shared'
import { injectUsersStore } from '../store'
import { HubConnection } from '@microsoft/signalr'
import { injectNotificationsStore } from '@overlays/notifications/data-access'
import { friendToWebUser } from '@auth/utils'
import { DeviceInfoModel } from '@shared/data-access/models'
// import { NotificationModel } from '@users/shared'

const hubName = 'Users'
const hubUrl = '/hubs/users'

@Injectable({
	providedIn: 'root',
})
export class UsersSignalrService {
	private _usersStore = injectUsersStore()
	private _notificationsStore = injectNotificationsStore()
	// private _signalrHubs = inject(SignalrHubsService)

	hubConnection: HubConnection | undefined
	// get hubConnection() {
	// 	return this._signalrHubs.usersHubConnection
	// }

	init(token: string, deviceInfo: DeviceInfoModel) {
		const request: HubConnectionRequest = {
			token,
			hubName,
			hubUrl,
		}
		this.hubConnection = createHubConnection(request)

		this.onHub(USERS_SIGNALR_EVENT.APP_USER_IS_CONNECTED, () => {
			console.log(USERS_SIGNALR_EVENT.APP_USER_IS_CONNECTED)
			this.invokeHub(USERS_SIGNALR_METHOD.SEND_DEVICE_INFO, deviceInfo)
		})

		this.onHub(USERS_SIGNALR_EVENT.USER_IS_ONLINE, (connection: ConnectionModel) => {
			console.log(USERS_SIGNALR_EVENT.USER_IS_ONLINE, connection)
		})

		this.onHub(USERS_SIGNALR_EVENT.USER_IS_ONLINE, (connection: ConnectionModel) => {
			console.log(USERS_SIGNALR_EVENT.USER_IS_ONLINE, connection)
		})

		this.onHub(USERS_SIGNALR_EVENT.USER_IS_OFFLINE, (connection: ConnectionModel) => {
			console.log(USERS_SIGNALR_EVENT.USER_IS_OFFLINE, connection)
		})

		this.onHub(USERS_SIGNALR_EVENT.GET_ONLINE_USERS, (connections: ConnectionModel[]) => {
			console.log(USERS_SIGNALR_EVENT.GET_ONLINE_USERS, connections)
		})

		this.onHub(USERS_SIGNALR_EVENT.GET_ONLINE_FRIENDS, (response: GetOnlineFriendsResponse) => {
			console.log(USERS_SIGNALR_EVENT.GET_ONLINE_FRIENDS, response)
		})

		this.onHub(USERS_SIGNALR_EVENT.GET_USER_FRIENDS, (response: GetUserFriendsResponse) => {
			this._usersStore.dispatch.addManyUsers(response.friends)
		})

		this.onHub(USERS_SIGNALR_EVENT.RECEIVE_FRIEND, (response: FriendModel) => {
			console.log(USERS_SIGNALR_EVENT.RECEIVE_FRIEND, response)
			const webUser = friendToWebUser(response)
			this._usersStore.dispatch.addUser(webUser)
		})

		this.onHub(
			USERS_SIGNALR_EVENT.RECEIVE_SEARCH_FOR_APP_USER_BY_USER_NAME_RESPONSE,
			(response: SearchForUserResponse) => {
				console.log(USERS_SIGNALR_EVENT.RECEIVE_SEARCH_FOR_APP_USER_BY_USER_NAME_RESPONSE, response)
				this._usersStore.dispatch.receiveUsersFromSearch(response.appUsers)
			},
		)

		this.onHub(
			USERS_SIGNALR_EVENT.RECEIVE_FRIEND_REQUEST_EVENT,
			(response: FriendRequestResponse) => {
				console.log(USERS_SIGNALR_EVENT.RECEIVE_FRIEND_REQUEST_EVENT, response)
			},
		)

		this.onHub(
			USERS_SIGNALR_EVENT.RECEIVE_APP_USER_NOTIFICATIONS,
			(response: ReceiveAppUserNotificationsResponse) => {
				console.log(USERS_SIGNALR_EVENT.RECEIVE_APP_USER_NOTIFICATIONS, response)
				this._notificationsStore.dispatch.addManyNotifications(response.notifications)
			},
		)

		this.onHub(USERS_SIGNALR_EVENT.RECEIVE_NOTIFICATION, (response: NotificationModel) => {
			console.log(USERS_SIGNALR_EVENT.RECEIVE_NOTIFICATION, response)
			this._notificationsStore.dispatch.addNotification(response)
			this.receiveNotification(response.id)
		})

		this.onHub(USERS_SIGNALR_EVENT.UPDATE_NOTIFICATION, (response: NotificationModel) => {
			console.log(USERS_SIGNALR_EVENT.UPDATE_NOTIFICATION, response)
			this._notificationsStore.dispatch.updateNotification({
				id: response.id,
				changes: response,
			})
		})

		this.onHub(USERS_SIGNALR_EVENT.NOTIFICATION_UPDATED, (response: UpdateNotificationResponse) => {
			console.log(USERS_SIGNALR_EVENT.NOTIFICATION_UPDATED, response)
		})

		return this.hubConnection
	}

	searchForAppUserByUserName(userName: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.SEARCH_FOR_APP_USER_BY_USER_NAME, userName)
	}

	sendFriendRequest(appUserId: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.SEND_FRIEND_REQUEST, appUserId)
	}

	acceptFriendRequest(appUserId: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.ACCEPT_FRIEND_REQUEST, appUserId)
	}

	rejectFriendRequest(appUserId: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.REJECT_FRIEND_REQUEST, appUserId)
	}

	removeFriend(appUserId: string) {
		// TODO: implement
		console.log('removeFriend', appUserId)
		// this.invokeHubConnection(USERS_SIGNALR_METHOD.REMOVE_FRIEND, appUserId)
	}

	getNotifications() {
		this.invokeHub(USERS_SIGNALR_METHOD.GET_NOTIFICATIONS)
	}

	// readNotification(notificationId: string) {
	// 	this.invokeHubConnection(USERS_SIGNALR_METHOD.READ_NOTIFICATION, notificationId)
	// }

	readManyNotifications(notificationIds: string[]) {
		this.invokeHub(USERS_SIGNALR_METHOD.READ_MANY_NOTIFICATIONS, notificationIds)
	}

	completeManyNotifications(notificationIds: string[]) {
		this.invokeHub(USERS_SIGNALR_METHOD.COMPLETE_MANY_NOTIFICATIONS, notificationIds)
	}

	receiveNotification(notificationId: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.RECEIVE_NOTIFICATION, notificationId)
	}

	deleteNotification(notificationId: string) {
		this.invokeHub(USERS_SIGNALR_METHOD.DELETE_NOTIFICATION, notificationId)
	}

	private onHub<T extends Record<string, any>>(
		event: UsersSignalrEvent,
		callback: (response: T) => void,
	) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		this.hubConnection.on(event, callback)
	}

	private invokeHub(invoke: string, params?: unknown) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		if (this.hubConnection.state !== 'Connected') throw new Error('Hub connection is not connected')

		if (invoke && params) {
			// const pascalCaseRequest = camelCaseToPascaleCaseNested(params)
			// console.log('invokeHubConnection', invoke, pascalCaseRequest)
			this.hubConnection.invoke(invoke, params).catch((err) => console.error(err, invoke, params))
		}
		if (invoke && !params) {
			this.hubConnection.invoke(invoke).catch((err) => console.error(err, invoke))
		}
	}
}
