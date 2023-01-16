/* eslint-disable @angular-eslint/component-class-suffix */
import { Inject, inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { StringsService } from '@grid-layout/data-access/services'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { ConnectionsStoreService } from '@shared/data-access/connections'

import {
  ConnectionModel,
  FriendRequestModel,
  NotificationModel,
  StringModel,
  UserModel,
} from '@shared/data-access/models'
import { NotificationsStoreService } from '@shared/data-access/notifications'
import { ShowHideComponent } from '@shared/ui/show-hide'
import { GetFriendRequestPipe } from 'libs/app/feature/notifications/src/lib/get-friend-request.pipe'
import { SortNotificationsPipe } from 'libs/app/feature/notifications/src/lib/sort-notifications.pipe'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notifications.dialog.html',
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
  ],
  standalone: true,
})
export class NotificationsDialog {

  private notificationsStore = inject(NotificationsStoreService)
  private authStore = inject(AuthStoreService)

  notifications$: Observable<NotificationModel[]> = this.notificationsStore.select.notifications$
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedNotification?: NotificationModel

  change(event: MatSelectionListChange) {
    console.log(event)
    this.selectedNotification = event.options[0].value

  }

  acceptFriend(requestedByUsername: string) {
    console.log(requestedByUsername)
  }
}

// FriendRequestModel
