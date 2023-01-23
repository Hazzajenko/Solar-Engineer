import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { MessagesService } from '@app/data-access/messages'
import { GroupChatMessageModel } from '@shared/data-access/models'
import { GroupChatsStoreService } from '../facades'
import { AllGroupChatsDataResponse } from '../models/all-group-chats.response'


@Injectable({
  providedIn: 'root',
})
export class GroupChatsService {

  private http = inject(HttpClient)
  private groupChatsStore = inject(GroupChatsStoreService)
  private messagesService = inject(MessagesService)

  waitForGroupChatsMessages() {
    if (!this.messagesService.messagesHub) return
    this.messagesService.messagesHub.on('getGroupChatMessages', (message: GroupChatMessageModel) => {
      if (Array.isArray(message)) {
        console.log('Array.isArray(getGroupChatMessages)', message)
        this.groupChatsStore.dispatch.addManyGroupChatMessages(message)
      } else {
        console.log('getGroupChatMessages', message)
        this.groupChatsStore.dispatch.addGroupChatMessage(message)
      }
    })
  }

  getAllGroupChats() {
    return this.http.get<AllGroupChatsDataResponse>('/api/group-chats/data')
  }


  /*

    sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
      /!*    return this.http.post<MessageResponse>(`/api/message/user/${request.recipientUsername}`, {
            ...request,
          })*!/
    }

  */

}
