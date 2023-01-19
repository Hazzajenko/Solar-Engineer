import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { AuthStoreService } from '@auth/data-access/facades'
import { Update } from '@ngrx/entity'

import { MessageModel, NotificationModel, NotificationStatus, UserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable } from 'rxjs'
import { MessagesStoreService } from '../../data-access'


@Component({
  selector: 'app-conversation-component',
  templateUrl: './conversation.component.html',
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
    MatCheckboxModule,
  ],
  standalone: true,
})
export class ConversationComponent {

  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  messages$: Observable<MessageModel[]> = this.messagesStore.select.messages$
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedMessage?: MessageModel
  unreadFilter = false

  change(event: MatSelectionListChange) {
    console.log(event)
    this.selectedMessage = event.options[0].value
    if ((event.options[0].value as NotificationModel).status === NotificationStatus.Unread) {
      this.readMessage()
    }
  }

  readMessage() {
    if (!this.selectedMessage) return
    const update: Update<NotificationModel> = {
      id: this.selectedMessage.id,
      changes: {
        status: NotificationStatus.Read,
      },
    }
    this.messagesStore.dispatch.updateMessage(update)
  }

  markAllMessagesAsRead(messages: MessageModel[]) {
    if (!messages) return
    const unreadMessages = messages.filter(message => message.status === NotificationStatus.Unread)
    if (!unreadMessages) return

    const updates: Update<MessageModel>[] = unreadMessages.map(notification => {
      const update: Update<MessageModel> = {
        id: notification.id,
        changes: {
          status: NotificationStatus.Read,
        },
      }
      return update
    })
    this.messagesStore.dispatch.updateManyMessages(updates)
  }

  openConversation(selectedMessage: MessageModel) {
    console.log(selectedMessage)
  }
}

