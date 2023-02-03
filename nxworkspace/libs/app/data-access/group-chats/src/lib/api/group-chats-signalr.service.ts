import { inject, Injectable } from '@angular/core'
import {
  GroupChatMessageModel,
  GroupChatServerMessageModel,
  InitialGroupChatMemberModel,
} from '@shared/data-access/models'
import { GroupChatsStoreService } from '../facades'
import { SendGroupChatMessageRequest } from '../models'
import { MessagesSignalrService } from '@app/data-access/signalr'
import { Update } from '@ngrx/entity'

// import nullCancellationToken = ts.server.nullCancellationToken

@Injectable({
  providedIn: 'root',
})
export class GroupChatsSignalrService {
  private groupChatsStore = inject(GroupChatsStoreService)
  // private messagesSignalrService = inject(MessagesSignalrService)
  private messagesSignalrService = inject(MessagesSignalrService)

  // private messagesHub = inject(MessagesSignalrService).messagesHub

  init() {
    this.onGetGroupChatMessages()
    this.onAddGroupChatMembers()
    this.onUpdateGroupChatMessages()
    this.onGetGroupChatServerMessages()
    this.onRemoveGroupChatMembers()
  }

  onGetGroupChatMessages() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'getGroupChatMessages',
      (messages: GroupChatMessageModel[]) => {
        this.groupChatsStore.dispatch.addManyGroupChatMessages(messages)
      },
    )
  }

  onUpdateGroupChatMessages() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'updateGroupChatMessages',
      (updates: Update<GroupChatMessageModel>[]) => {
        this.groupChatsStore.dispatch.updateManyGroupChatMessages(updates)
      },
    )
  }

  onAddGroupChatMembers() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'addGroupChatMembers',
      // 'getGroupChatServerMessages',
      (members: InitialGroupChatMemberModel[]) => {
        console.log(members)
        this.groupChatsStore.dispatch.addManyGroupChatMembers(members)
      },
    )
  }

  onGetGroupChatServerMessages() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'getGroupChatServerMessages',
      // 'getGroupChatServerMessages',
      (serverMessages: GroupChatServerMessageModel[]) => {
        console.log(serverMessages)
        this.groupChatsStore.dispatch.addManyGroupChatServerMessages(serverMessages)
      },
    )
  }

  onRemoveGroupChatMembers() {
    if (!this.messagesSignalrService.messagesHub) return
    this.messagesSignalrService.messagesHub.on(
      'removeGroupChatMembers',
      (groupChatMemberIds: number[]) => {
        // this.messagesHub.on('removeGroupChatMembers', (groupChatMemberIds: number[]) => {
        this.groupChatsStore.dispatch.removeManyGroupChatMembers(groupChatMemberIds)
      },
    )
  }

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
  }
}