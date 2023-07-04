import { Injectable } from '@angular/core'
import { createHubConnection, HubConnectionRequest } from '@app/data-access/signalr'
import {
	GetGroupChatMessagesRequest,
	GetGroupChatMessagesResponse,
	GetLatestGroupChatMessagesResponse,
	GetLatestMessagesResponse,
	GetLatestUserMessagesResponse,
	GetMessagesWithUserRequest,
	GetMessagesWithUserResponse,
	GroupChatMembersAddedResponse,
	GroupChatMembersRemovedResponse,
	InviteUsersToGroupChatRequest,
	MESSAGES_SIGNALR_EVENT,
	MESSAGES_SIGNALR_METHOD,
	MessagesSignalrEvent,
	ReceiveMessageResponse,
	RemoveUsersFromGroupChatRequest,
	SendGroupChatMessageRequest,
	SendMessageRequest,
} from '@auth/shared'
import { injectGroupChatsSharedStore, injectMessagesStore } from '../store'
import { HubConnection } from '@microsoft/signalr'

const hubName = 'Messages'
const hubUrl = '/hubs/messages'

@Injectable({
	providedIn: 'root',
})
export class MessagesSignalrService {
	private _messagesStore = injectMessagesStore()
	private _groupChatsStore = injectGroupChatsSharedStore()

	hubConnection: HubConnection | undefined

	init(token: string) {
		const request: HubConnectionRequest = {
			token,
			hubName,
			hubUrl,
		}
		this.hubConnection = createHubConnection(request)

		this.onHub(MESSAGES_SIGNALR_EVENT.RECEIVE_MESSAGE, (response: ReceiveMessageResponse) => {
			console.log(MESSAGES_SIGNALR_EVENT.RECEIVE_MESSAGE, response)
			this._messagesStore.dispatch.addMessage(response.message)
		})

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GET_MESSAGES_WITH_USER,
			(response: GetMessagesWithUserResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GET_MESSAGES_WITH_USER, response)
				this._messagesStore.dispatch.addManyMessages(response.messages)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GET_LATEST_USER_MESSAGES,
			(response: GetLatestUserMessagesResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GET_LATEST_USER_MESSAGES, response)
				// this._messagesStore.dispatch.loadLatestMessages(response)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GET_LATEST_MESSAGES,
			(response: GetLatestMessagesResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GET_LATEST_MESSAGES, response)
				this._messagesStore.dispatch.loadLatestMessages(response.messages)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GET_LATEST_GROUP_CHAT_MESSAGES,
			(response: GetLatestGroupChatMessagesResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GET_LATEST_GROUP_CHAT_MESSAGES, response)
				this._groupChatsStore.chats.dispatch.addManyGroupChats(response.groupChats)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GET_GROUP_CHAT_MESSAGES,
			(response: GetGroupChatMessagesResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GET_GROUP_CHAT_MESSAGES, response)
				// this._groupChatsStore.messages.dispatch.addManyGroupChatMessages(response.groupChatMessages)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GROUP_CHAT_MEMBERS_ADDED,
			(response: GroupChatMembersAddedResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GROUP_CHAT_MEMBERS_ADDED, response)
			},
		)

		this.onHub(
			MESSAGES_SIGNALR_EVENT.GROUP_CHAT_MEMBERS_REMOVED,
			(response: GroupChatMembersRemovedResponse) => {
				console.log(MESSAGES_SIGNALR_EVENT.GROUP_CHAT_MEMBERS_REMOVED, response)
			},
		)

		return this.hubConnection
	}

	getMessagesWithUser(request: GetMessagesWithUserRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.GET_MESSAGES_WITH_USER, request)
	}

	sendMessageToUser(request: SendMessageRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.SEND_MESSAGE_TO_USER, request)
	}

	sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.SEND_MESSAGE_TO_GROUP_CHAT, request)
	}

	inviteUsersToGroupChat(request: InviteUsersToGroupChatRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.INVITE_USERS_TO_GROUP_CHAT, request)
	}

	getGroupChatMessages(request: GetGroupChatMessagesRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.GET_GROUP_CHAT_MESSAGES, request)
	}

	removeUsersFromGroupChat(request: RemoveUsersFromGroupChatRequest) {
		this.invokeHub(MESSAGES_SIGNALR_METHOD.REMOVE_USERS_FROM_GROUP_CHAT, request)
	}

	private onHub<T extends Record<string, any>>(
		event: MessagesSignalrEvent,
		callback: (response: T) => void,
	) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		this.hubConnection.on(event, callback)
	}

	private invokeHub(invoke: string, params?: unknown) {
		if (!this.hubConnection) throw new Error('Hub connection is not initialized')
		if (this.hubConnection.state !== 'Connected') throw new Error('Hub connection is not connected')

		if (invoke && params) {
			this.hubConnection.invoke(invoke, params).catch((err) => {
				console.error(err, invoke, params)
				throw err
			})
		}
		if (invoke && !params) {
			this.hubConnection.invoke(invoke).catch((err) => {
				console.error(err, invoke)
				throw err
			})
		}
	}
}
