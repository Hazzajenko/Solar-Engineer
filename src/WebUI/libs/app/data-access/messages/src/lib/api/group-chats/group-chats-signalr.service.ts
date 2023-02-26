import { inject, Injectable } from '@angular/core'
import { GroupChatMessageModel, InitialGroupChatMemberModel } from '@shared/data-access/models'

import { GroupChatsStoreService } from '../../services/group-chats'
import { SendGroupChatMessageRequest } from '../../models/requests/send-group-chat-message.request'
import {
  AddGroupChatMembers,
  GetGroupChatMessages,
  RemoveGroupChatMembers,
  SendMessageToGroupChat,
} from '../user-messages/user-messages-signalr.methods'
import { HubConnection } from '@microsoft/signalr'
import { throwExpression } from '@shared/utils'
import { MessagesSignalrService } from '../messages-signalr.service'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsSignalrService {
  private groupChatsStore = inject(GroupChatsStoreService)
  private messagesSignalRService = inject(MessagesSignalrService)
  messagesHubConnection: HubConnection =
    this.messagesSignalRService.messagesHubConnection ??
    throwExpression('Not connected to messages hub')

  initGroupChatsHandlers() {
    this.messagesHubConnection.on(GetGroupChatMessages, (messages: GroupChatMessageModel[]) => {
      this.groupChatsStore.dispatch.addManyGroupChatMessages(messages)
    })

    this.messagesHubConnection.on(AddGroupChatMembers, (members: InitialGroupChatMemberModel[]) => {
      this.groupChatsStore.dispatch.addManyGroupChatMembers(members)
    })

    this.messagesHubConnection.on(RemoveGroupChatMembers, (groupChatMemberIds: string[]) => {
      this.groupChatsStore.dispatch.removeManyGroupChatMembers(groupChatMemberIds)
    })
  }

  getMessagesWithGroupChat(groupChatId: number) {
    this.messagesHubConnection
      .invoke(GetGroupChatMessages, groupChatId)
      .catch((error) => console.error(error))
  }

  sendMessageToGroupChat(request: SendGroupChatMessageRequest) {
    return this.messagesHubConnection
      .invoke(SendMessageToGroupChat, request)
      .catch((error) => console.error(error))
  }
}
