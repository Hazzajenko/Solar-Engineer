import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { MessagesService, SendMessageRequest } from '@app/messages'
import { GroupChatMessageModel, MessageModel } from '@shared/data-access/models'
import { GroupChatsStoreService } from '../facades'
import { AllGroupChatsDataResponse } from '../models/all-group-chats.response'
import { CreateGroupChatRequest, SendGroupChatMessageRequest } from '../models'
import { MessagesSignalrService } from '@app/data-access/signalr'
import { CreateGroupChatResponse } from '../models/create-group-chat.response'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsService {
  private http = inject(HttpClient)
  private groupChatsStore = inject(GroupChatsStoreService)
  private messagesService = inject(MessagesService)
  private messagesSignalrService = inject(MessagesSignalrService)

  createGroupChat(request: CreateGroupChatRequest) {
    return this.http.post<CreateGroupChatResponse>('/api/group-chats', {
      ...request,
    })
  }

  waitForGroupChatsMessages() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'getGroupChatMessages',
      (message: GroupChatMessageModel) => {
        if (Array.isArray(message)) {
          console.log('Array.isArray(getGroupChatMessages)', message)
          this.groupChatsStore.dispatch.addManyGroupChatMessages(message)
        } else {
          console.log('getGroupChatMessages', message)
          this.groupChatsStore.dispatch.addGroupChatMessage(message)
        }
      },
    )
  }

  getAllGroupChats() {
    return this.http.get<AllGroupChatsDataResponse>('/api/group-chats/data')
  }

  getMessagesWithGroupChatSignalR(groupChatId: number) {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub
      .invoke('getGroupChatMessages', groupChatId)
      .then((data) => {
        console.log(data)
      })
  }

  sendMessageToGroupChatSignalR(request: SendGroupChatMessageRequest) {
    if (!this.messagesSignalrService.messagesHub) return
    return this.messagesSignalrService.messagesHub
      .invoke('sendMessageToGroupChat', request)
      .catch((error) => console.log(error))
  }

  /*

    sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
      /!*    return this.http.post<MessageResponse>(`/api/message/user/${request.recipientUsername}`, {
            ...request,
          })*!/
    }

  */
}
