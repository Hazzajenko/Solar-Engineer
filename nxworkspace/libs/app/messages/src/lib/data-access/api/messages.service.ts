import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { ManyUpdatesResponse, MessageModel, UpdateResponse } from '@shared/data-access/models'
import { AllMessagesResponse } from '../models/all-messages.response'

import { MessageResponse } from '../models/message.response'
import { MessagesFilter } from '../models/messages.filter'


@Injectable({
  providedIn: 'root',
})
export class MessagesService {

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

  sendMessageToUser(message: MessageModel) {
    return this.http.post<MessageResponse>(`/api/message/user/${message.recipientUsername}`, {
      ...message,
    })
  }

  getAllMessages(filter?: MessagesFilter) {
    if (filter) {
      return this.http.get<AllMessagesResponse>(`/api/messages?filter=${filter}`)
    }
    return this.http.get<AllMessagesResponse>(`/api/messages`)
  }

}
