import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { MessagesStoreService } from '@app/data-access/messages'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'
import { Update } from '@ngrx/entity'

import { MessageModel, NotificationModel, NotificationStatus, UserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable } from 'rxjs'

import { ConversationComponent } from '../conversation/conversation.component'
import { MessageDirective } from './message.directive'
import { SortMessagesPipe } from './sort-messages.pipe'


@Component({
  selector: 'app-messages-component',
  templateUrl: './messages.component.html',
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
    MessageDirective,
    SortMessagesPipe,
    MatCheckboxModule,
    LetModule,
  ],
  standalone: true,
})
export class MessagesComponent {

  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)

  messages$: Observable<MessageModel[] | undefined> = this.messagesStore.select.firstMessageOfEveryConversation$()
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedMessage?: MessageModel
  unreadFilter = false


  constructor() {
    this.messagesStore.select.firstMessageOfEveryConversation$().subscribe(res => console.log(res))
  }

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

  openConversation(selectedMessage: MessageModel, recipient: string | undefined) {
    if (!recipient) return
    console.log(selectedMessage)

    const dialogConfig = {
      // disableClose: true,
      autoFocus: true,
      height: '800px',
      width: '1000px',
      data: {
        recipient,
      },
    } as MatDialogConfig
    /*   dialogConfig.data = {
         stringId: panel.stringId,
       }*/
    this.dialog.open(ConversationComponent, dialogConfig)
  }
}

