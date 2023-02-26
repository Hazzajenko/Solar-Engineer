import { HttpClient, HttpResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { MessagesSignalrService } from '@app/data-access/signalr'
import { GROUP_CHATS } from './group-chats.endpoint'
import { GroupChatsStoreService } from '../../services/group-chats'
import { CreateGroupChatRequest } from '../../models/requests/create-group-chat.request'
import { CreateGroupChatResponse } from '../../models/responses/create-group-chat.response'
import { InviteToGroupChatRequest } from '../../models/requests/invite-to-group-chat.request'
import { RemoveFromGroupChatRequest } from '../../models/requests/remove-from-group-chat.request'
import { AllGroupChatsDataResponse } from '../../models/responses/all-group-chats.response'
import { InitialCombinedGroupChatsResponse } from '../../models/responses/initial-combined-group-chats.response'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsService {
  private http = inject(HttpClient)
  private groupChatsStore = inject(GroupChatsStoreService)
  private messagesSignalrService = inject(MessagesSignalrService)

  createGroupChat(request: CreateGroupChatRequest) {
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
  }

  getAllGroupChats() {
    return this.http.get<AllGroupChatsDataResponse>(`/api/${GROUP_CHATS}/data`)
  }

  getInitialCombinedGroupChats() {
    return this.http.get<InitialCombinedGroupChatsResponse>(`/api/${GROUP_CHATS}/data`)
  }
}
