import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GroupChatsStoreService } from '../facades'
import { SignalrService } from '@app/data-access/signalr'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsService {
  private http = inject(HttpClient)
  private groupChatsStore = inject(GroupChatsStoreService)
  private messagesSignalrService = inject(SignalrService)

  /*  createGroupChat(request: CreateGroupChatRequest) {
      return this.http.post<CreateGroupChatResponse>(`/api/${GROUP_CHATS}`, {
        ...request,
      })
    }

    inviteToGroupChat(request: InviteToGroupChatRequest) {
      return this.http.post<HttpResponse<any>>(`/api/${GROUP_CHATS}/${request.groupChatId}/invites`, {
        invites: request.invites,
      })
    }

    removeFromGroupChat(request: RemoveFromGroupChatRequest) {
      return this.http.delete<HttpResponse<any>>(`/api/${GROUP_CHATS}/${request.groupChatId}/users`, {
        body: {
          userNames: request.userNames,
        },
      })
    }*/

  /*
    waitForGroupChatMessages() {
      if (!this.messagesSignalrService.messagesHub) return
      this.messagesSignalrService.messagesHub.on(
        'getGroupChatMessages',
        (message: GroupChatMessageModel | GroupChatMessageModel[]) => {
          if (Array.isArray(message)) {
            this.groupChatsStore.dispatch.addManyGroupChatMessages(message)
          } else {
            this.groupChatsStore.dispatch.addGroupChatMessage(message)
          }
        },
      )
    }

    waitForGroupChatServerMessages() {
      if (!this.messagesSignalrService.messagesHub) return
      this.messagesSignalrService.messagesHub.on(
        'getGroupChatServerMessages',
        (serverMessage: GroupChatServerMessageModel | GroupChatServerMessageModel[]) => {
          if (Array.isArray(serverMessage)) {
            this.groupChatsStore.dispatch.addManyGroupChatServerMessages(serverMessage)
          } else {
            this.groupChatsStore.dispatch.addGroupChatServerMessage(serverMessage)
          }
        },
      )
    }*/

  /*  getAllGroupChats() {
      return this.http.get<AllGroupChatsDataResponse>(`/api/${GROUP_CHATS}/data`)
    }

    getInitialCombinedGroupChats() {
      return this.http.get<InitialCombinedGroupChatsResponse>(`/api/${GROUP_CHATS}/data`)
    }*/

  /*
    getMessagesWithGroupChatSignalR(groupChatId: number) {
      if (!this.messagesSignalrService.messagesHub) return
      this.messagesSignalrService.messagesHub
        .invoke('getGroupChatMessages', groupChatId)
        .catch((error) => console.log(error))
    }

    sendMessageToGroupChatSignalR(request: SendGroupChatMessageRequest) {
      if (!this.messagesSignalrService.messagesHub) return
      return this.messagesSignalrService.messagesHub
        .invoke('sendMessageToGroupChat', request)
        .catch((error) => console.log(error))
    }*/

  /*

    sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
      /!*    return this.http.post<MessageResponse>(`/api/message/user/${request.recipientUsername}`, {
            ...request,
          })*!/
    }

  */
}
