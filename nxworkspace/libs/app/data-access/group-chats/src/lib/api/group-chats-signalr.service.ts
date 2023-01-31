import { inject, Injectable } from '@angular/core'
import { GroupChatMessageModel, GroupChatServerMessageModel } from '@shared/data-access/models'
import { GroupChatsStoreService } from '../facades'
import { SendGroupChatMessageRequest } from '../models'
import { MessagesSignalrService } from '@app/data-access/signalr'
import { Update } from '@ngrx/entity'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsSignalrService {
  private groupChatsStore = inject(GroupChatsStoreService)
  // private messagesSignalrService = inject(MessagesSignalrService)
  private messagesHub = inject(MessagesSignalrService).messagesHub

  init() {
    this.onGetGroupChatMessages()
    this.onUpdateGroupChatMessages()
    this.onGetGroupChatServerMessages()
    this.onRemoveGroupChatMembers()
  }

  onGetGroupChatMessages() {
    if (!this.messagesHub) return
    this.messagesHub.on('getGroupChatMessages', (messages: GroupChatMessageModel[]) => {
      this.groupChatsStore.dispatch.addManyGroupChatMessages(messages)
    })
  }

  onUpdateGroupChatMessages() {
    if (!this.messagesHub) return
    this.messagesHub.on('updateGroupChatMessages', (updates: Update<GroupChatMessageModel>[]) => {
      this.groupChatsStore.dispatch.updateManyGroupChatMessages(updates)
    })
  }

  onGetGroupChatServerMessages() {
    if (!this.messagesHub) return
    this.messagesHub.on(
      'getGroupChatServerMessages',
      (serverMessages: GroupChatServerMessageModel[]) => {
        this.groupChatsStore.dispatch.addManyGroupChatServerMessages(serverMessages)
      },
    )
  }

  onRemoveGroupChatMembers() {
    if (!this.messagesHub) return
    this.messagesHub.on('removeGroupChatMembers', (groupChatMemberIds: number[]) => {
      this.groupChatsStore.dispatch.removeManyGroupChatMembers(groupChatMemberIds)
    })
  }

  getMessagesWithGroupChatSignalR(groupChatId: number) {
    if (!this.messagesHub) return
    this.messagesHub
      .invoke('getGroupChatMessages', groupChatId)
      .catch((error) => console.log(error))
  }

  sendMessageToGroupChatSignalR(request: SendGroupChatMessageRequest) {
    if (!this.messagesHub) return
    return this.messagesHub
      .invoke('sendMessageToGroupChat', request)
      .catch((error) => console.log(error))
  }
}
