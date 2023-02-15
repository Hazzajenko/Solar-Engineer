/* eslint-disable @angular-eslint/component-class-suffix */
import { ScrollingModule } from '@angular/cdk/scrolling'
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { FriendsService, FriendsStoreService } from '@app/data-access/friends'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'
import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access/facades'
import { Update } from '@ngrx/entity'

import { NotificationModel, NotificationStatus, UserModel } from '@shared/data-access/models'
import { NotificationsStoreService } from '@shared/data-access/notifications'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { GetFriendRequestPipe } from 'libs/app/feature/notifications/src/lib/get-friend-request.pipe'
import { SortNotificationsPipe } from 'libs/app/feature/notifications/src/lib/sort-notifications.pipe'
import { Observable } from 'rxjs'
import { NotificationsComponent } from '../../../notifications/src/lib/component/notifications.component'
import { ProfileComponent } from './component'

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './profile.dialog.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ShowHideComponent,
    NgClass,
    MatCardModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,
    SortNotificationsPipe,
    GetFriendRequestPipe,
    MatTabsModule,
    NotificationsComponent,
    FriendsComponent,
    ProfileComponent,
    MessagesComponent,
    ChatroomsComponent,
  ],
  standalone: true,
})
export class ProfileDialog {
  private notificationsStore = inject(NotificationsStoreService)
  private authStore = inject(AuthStoreService)
  private friendsService = inject(FriendsService)
  private friendsStore = inject(FriendsStoreService)

  selected = new FormControl(0)
  notifications$: Observable<NotificationModel[]> = this.notificationsStore.select.notifications$
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedNotification?: NotificationModel

  change(event: MatSelectionListChange) {
    console.log(event)
    this.selectedNotification = event.options[0].value
    /*    if ((event.options[0].value as NotificationModel).status === NotificationStatus.Unread) {
          this.readNotification()
        }*/
  }

  acceptFriend(requestedByUsername: string) {
    console.log(requestedByUsername)
    this.friendsStore.dispatch.acceptFriendRequest(requestedByUsername)
  }

  readNotification() {
    if (!this.selectedNotification) return
    /*    const update: Update<NotificationModel> = {
          id: this.selectedNotification.id,
          changes: {
            status: NotificationStatus.Read,
          },
        }*/
    // this.notificationsStore.dispatch.updateNotification(update)
  }

  markAllNotificationsAsRead(notifications: NotificationModel[]) {
    if (!notifications) return
    /*    const unReadNotifications = notifications.filter(notification => notification.status === NotificationStatus.Unread)
        if (!unReadNotifications) return

        const updates: Update<NotificationModel>[] = unReadNotifications.map(notification => {
          const update: Update<NotificationModel> = {
            id: notification.id,
            changes: {
              status: NotificationStatus.Read,
            },
          }
          return update
        })
        this.notificationsStore.dispatch.updateManyNotifications(updates)*/
  }
}