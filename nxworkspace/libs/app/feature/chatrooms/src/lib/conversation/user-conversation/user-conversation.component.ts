import { ScrollingModule } from '@angular/cdk/scrolling'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import {
  AsyncPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { ActivatedRoute, Router } from '@angular/router'
import { MessagesComponent } from '@app/messages'
import { MessagesStoreService, SendMessageRequest } from '@app/data-access/messages'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'

import {
  CombinedMessageUserModel,
  MessageFrom,
  MessageModel,
  MessageWebUserModel,
  UserModel,
  WebUserModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable } from 'rxjs'

import { ConversationMessageDirective, ScrollViewportDirective } from '@shared/directives'
import { MessageBarComponent } from '../message-bar/message-bar.component'
import { GetCdnUrlStringPipe, SortConversationMessagesPipe } from '@shared/pipes'
import { YouOrUserNamePipe } from '../../../../../../../shared/pipes/src/lib/text'
import { MessageItemComponent } from '../message-item/message-item.component'
import { MessageOptionsBarComponent } from '../options-bar/message-options-bar.component'
import { UsersService, UsersStoreService } from '@app/data-access/users'

@Component({
  selector: 'app-user-conversation-component',
  templateUrl: './user-conversation.component.html',
  styles: [
    `
      html,
      body {
        height: 100%;
        width: 100%;
        margin: 0px;
        padding: 0px;
        overflow: hidden;
      }

      *::-webkit-scrollbar {
        width: 12px;
      }

      ::-webkit-scrollbar-track {
        background-color: transparent;
      }

      ::-webkit-scrollbar-thumb {
        /*      background-color: #9b9fd8;
            border-radius: 20px;
            border: 6px solid transparent;
            background-clip: content-box;*/
        background-color: #60a1fa;
        border-radius: 20px;
        border: 1px solid #3e8bf5;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #a8bbbf;
      }
    `,
  ],
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
    LetModule,
    MessagesComponent,

    ScrollViewportDirective,
    ConversationMessageDirective,
    MessageBarComponent,
    SortConversationMessagesPipe,
    GetCdnUrlStringPipe,
    YouOrUserNamePipe,
    NgTemplateOutlet,
    MessageItemComponent,
    MessageOptionsBarComponent,
  ],
  standalone: true,
})
export class UserConversationComponent {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private usersStore = inject(UsersStoreService)
  readonly MessageFrom = MessageFrom

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )

  userMessages$?: Observable<MessageWebUserModel[]>
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedConversationMessage?: MessageWebUserModel
  unreadFilter = false
  recipient?: string
  recipientUser$?: Observable<WebUserModel>
  scrollIndex = 0

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  @Input() set recipientImport(recipient: string | undefined) {
    if (!recipient) return
    this.recipient = recipient
    // this.userMessages$ = this.messagesStore.select.messagesWithUser2$(recipient)
    this.userMessages$ = this.messagesStore.select.messagesWithUser$(recipient)
    this.recipientUser$ = this.usersStore.select.webUserCombinedByUserName$(recipient)
  }

  sendMessage(message: string) {
    if (!this.recipient) return

    const request: SendMessageRequest = {
      recipientUsername: this.recipient,
      content: message,
    }

    this.messagesStore.dispatch.sendMessageToUser(request)
  }

  selectMessage(message: MessageWebUserModel) {
    if (this.selectedConversationMessage && this.selectedConversationMessage.id === message.id) {
      this.selectedConversationMessage = undefined
      return
    }
    this.selectedConversationMessage = message
    return
  }

  async toggleFullScreen() {
    this.dialog.closeAll()
    await this.router.navigateByUrl('messages')
  }
}
