import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetManyNotificationsResponse } from '../models/get-many-notifications.response'

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private http = inject(HttpClient)


  getNotifications() {
    return this.http.get<GetManyNotificationsResponse>(`/api/notifications`)
  }

  markNotificationAsRead(notificationId: number) {
    return this.http.put(`/api/notifications/${notificationId}`, {})
    // .pipe(map((response) => response.user))
  }
}
