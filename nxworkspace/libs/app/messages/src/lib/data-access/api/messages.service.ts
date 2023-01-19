import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Update } from '@ngrx/entity'
import { ManyUpdatesResponse, MessageModel, UpdateResponse } from '@shared/data-access/models'
import { SignalrLogger } from '@shared/data-access/signalr'
import { MessagesStoreService } from '../facades'
import { AllMessagesResponse } from '../models/all-messages.response'

import { MessageResponse } from '../models/message.response'
import { MessagesFilter } from '../models/messages.filter'


@Injectable({
  providedIn: 'root',
})
export class MessagesService {

  private http = inject(HttpClient)
  private messagesStore = inject(MessagesStoreService)
  private messagesHub?: HubConnection

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

  createMessagesConnection(token: string) {
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

    this.messagesHub.on('getMessages', message => {
      console.log('getMessages', message)
      this.messagesStore.dispatch.addMessage(message)
    })
  }

  private getConnectionId = () => {
    if (!this.messagesHub) return
    this.messagesHub.invoke('getConnectionId')
      .then((data) => {
        console.log(data)
        // this.connectionId = data
        // this.getNotifications()
      })
  }

}
