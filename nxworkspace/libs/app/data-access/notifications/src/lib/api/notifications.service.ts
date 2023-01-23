import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Update } from '@ngrx/entity'
import { NotificationModel, NotificationType } from '@shared/data-access/models'
import { SignalrLogger } from '@shared/data-access/signalr'
import { NotificationsStoreService } from '../facades'
import { ManyNotificationsResponse } from '../models'
import { UpdateManyNotificationsResponse } from '../models/update-many-notifications.response'
import { UpdateNotificationResponse } from '../models/update-notification.response'


@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private notificationHub?: HubConnection
  private notificationsStore = inject(NotificationsStoreService)
  private http = inject(HttpClient)
  connectionId?: string


  updateNotification(update: Update<NotificationModel>, type: NotificationType) {
    return this.http.put<UpdateNotificationResponse>(`/api/notification/${update.id}`, {
      ...update,
      type,
    })
  }

  updateManyNotifications(updates: Update<NotificationModel>[]) {
    return this.http.put<UpdateManyNotificationsResponse>(`/api/notifications`, {
      updates,
    })
  }


  getAllUserNotifications() {
    return this.http.get<ManyNotificationsResponse>('/api/notifications')
  }

  createNotificationsConnection(token: string) {
    this.notificationHub = new HubConnectionBuilder()
      .withUrl('/ws/hubs/notifications', {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(new SignalrLogger())
      .withAutomaticReconnect()
      .build()

    this.notificationHub
      .start()
      .then(() => console.log('Connection started'))
      .then(() => this.getConnectionId())
      .catch(err => console.log('Error while starting connection: ' + err))

    this.notificationHub.on('getNotifications', notification => {
      console.log('getNotifications', notification)
      if ('friendRequest' in notification) {
        this.notificationsStore.dispatch.addNotification(notification)

      }
    })
  }

  /*  connectSignalR() {
      if (!this.notificationHub) return

      this.notificationHub
        .start()
        .then(() => console.log('Connection started'))
        .then(() => this.getConnectionId())
        .catch(err => console.log('Error while starting connection: ' + err))

      this.notificationHub.on('getNotifications', notification => {
        console.log('getNotifications', notification)
      })
    }*/

  private getConnectionId = () => {
    if (!this.notificationHub) return
    this.notificationHub.invoke('getConnectionId')
      .then((data) => {
        console.log(data)
        this.connectionId = data
        this.getNotifications()
      })
  }
  public getNotifications = () => {
    if (!this.notificationHub) return
    if (!this.connectionId) return
    this.notificationHub.invoke('GetNotifications', this.connectionId)
      .catch(err => console.error(err))
  }


  stopHubConnection() {
    if (!this.notificationHub) return
    this.notificationHub.stop().catch(error => console.log(error))
  }
}