import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { MessagesSignalrService } from '@app/data-access/signalr'
import { HubConnection } from '@microsoft/signalr'
import { Update } from '@ngrx/entity'
import { ManyUpdatesResponse, MessageModel, UpdateResponse } from '@shared/data-access/models'
import { MessagesStoreService } from '../facades'
import { AllMessagesResponse } from '../models/all-messages.response'

import { MessageResponse } from '../models/message.response'
import { MessagesFilter } from '../models/messages.filter'
import { SendMessageRequest } from '../models'
import { ManyLatestUserMessagesResponse } from '../models/many-latest-user-messages.response'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private http = inject(HttpClient)
  private messagesStore = inject(MessagesStoreService)
  private messagesSignalR = inject(MessagesSignalrService)
  public messagesHub?: HubConnection

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
    return this.http.post<MessageResponse>(`/api/message/user/${request.recipientUsername}`, {
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

  // ManyLatestUserMessagesResponse

  getAllMessagesWithUser(userName: string) {
    return this.http.get<AllMessagesResponse>(`/api/messages/user/${userName}`)
  }

  /*  createMessagesConnection(token: string) {
      this.messagesHub = new HubConnectionBuilder()
        .withUrl('/ws/hubs/messages', {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .configureLogging(new SignalrLogger())
        .withAutomaticReconnect()
        .build()

      this.messagesHub
        .start()
        .then(() => console.log('Connection started'))
        .catch(err => console.log('Error while starting connection: ' + err))

      this.messagesHub.on('getMessages', (message: MessageModel) => {
        if (Array.isArray(message)) {
          console.log('Array.isArray(message)', message)
          this.messagesStore.dispatch.addManyMessages(message)
        } else {
          console.log('getMessages', message)
          this.messagesStore.dispatch.addMessage(message)
        }

      })
    }*/

  waitForGetMessages() {
    if (!this.messagesSignalR.messagesHub) return
    this.messagesSignalR.messagesHub.on('getMessages', (message: MessageModel) => {
      if (Array.isArray(message)) {
        console.log('Array.isArray(message)', message)
        this.messagesStore.dispatch.addManyMessages(message)
      } else {
        console.log('getMessages', message)
        this.messagesStore.dispatch.addMessage(message)
      }
    })
  }

  sendMessageToUserSignalR(request: SendMessageRequest) {
    if (!this.messagesSignalR.messagesHub) return
    return this.messagesSignalR.messagesHub
      .invoke('SendMessageToUser', request)
      .catch((error) => console.log(error))
  }

  getMessagesWithUserSignalR(userName: string) {
    if (!this.messagesSignalR.messagesHub) return
    this.messagesSignalR.messagesHub.invoke('getMessages', userName).then((data) => {
      console.log(data)
    })
  }
}