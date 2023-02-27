import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { ManyUpdatesResponse, MessageModel, UpdateResponse } from '@shared/data-access/models'
import { AllMessagesResponse } from '../../models/responses/all-messages.response'

import { MessageResponse } from '../../models/responses/message.response'
import { MessagesFilter } from '../../models/requests/messages.filter'
// import { SendMessageRequest } from '../../models'
import { ManyLatestUserMessagesResponse } from '../../models/responses/many-latest-user-messages.response'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SendMessageRequest } from '../../models/requests/send-message.request'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesService {
  private http = inject(HttpClient)

  updateMessage(update: Update<MessageModel>) {
    return this.http.put<UpdateResponse>(`/api/message/${update.id}`, {
      ...update,
    })
  }

  updateManyMessages(updates: Update<MessageModel>[]) {
    return this.http.put<ManyUpdatesResponse>(`/api/messages`, {
      updates,
    })
  }

  sendMessageToUser(request: SendMessageRequest) {
    return this.http.post<MessageResponse>(`/api/message/user/${request.recipientUserId}`, {
      ...request,
    })
  }

  getAllMessages(filter?: MessagesFilter) {
    if (filter) {
      return this.http.get<AllMessagesResponse>(`/api/messages?filter=${filter}`)
    }
    return this.http.get<AllMessagesResponse>(`/api/messages`)
  }

  getLatestUserMessages(): Observable<MessageModel[]> {
    return this.http
      .get<ManyLatestUserMessagesResponse>(`/api/messages/latest`)
      .pipe(map(({ messages }) => messages.map((message) => message.message)))
  }

  getAllMessagesWithUser(userName: string) {
    return this.http.get<AllMessagesResponse>(`/api/messages/user/${userName}`)
  }
}
