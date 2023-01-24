import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
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
} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { ActivatedRoute, Router } from '@angular/router'
import { MessagesComponent, MessagesStoreService, SendMessageRequest } from '@app/messages'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'
import { Update } from '@ngrx/entity'

import {
  GroupChatCombinedModel,
  GroupChatMessageModel,
  MessageModel,
  NotificationModel,
  NotificationStatus,
  UserModel,
  WindowSizeModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable, take } from 'rxjs'

import { MessageDirective } from '../../../../../messages/src/lib/feature/component/message.directive'
import { SortMessagesPipe } from '../../../../../messages/src/lib/feature/component/sort-messages.pipe'
import { ConversationMessageDirective } from '../../../../../messages/src/lib/feature/conversation/conversation-message.directive'
import { ScrollViewportDirective } from '../../../../../messages/src/lib/feature/conversation/scroll-viewport.directive'
import { SortConversationMessagesPipe } from '../../../../../messages/src/lib/feature/conversation/sort-conversation-messages.pipe'
import { IsLastMessagePipe } from '../is-last-message.pipe'
import { LastMessageIdPipe } from '../last-message-id.pipe'
import { SelectChatroomModel } from '../select-chatroom.model'
import { GroupChatsStoreService } from '@app/data-access/group-chats'

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
    MessageDirective,
    SortMessagesPipe,
    ScrollViewportDirective,
    ConversationMessageDirective,
    SortConversationMessagesPipe,
    IsLastMessagePipe,
    LastMessageIdPipe,
  ],
  standalone: true,
})
export class UserConversationComponent implements OnInit {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private groupChatsStore = inject(GroupChatsStoreService)

  // public dialogRef!: MatDialogRef<ChatroomsComponent>
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  messages$: Observable<MessageModel[] | undefined> =
    this.messagesStore.select.firstMessageOfEveryConversation$()
  userMessages$?: Observable<MessageModel[] | undefined>
  groupChatCombined$?: Observable<GroupChatCombinedModel | undefined>
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedMessage?: MessageModel
  selectedConversationMessage?: MessageModel
  unreadFilter = false
  recipient?: string
  messageControl = new FormControl('', [])
  scrollIndex = 0
  containerHeight?: number
  containerWidth?: number
  windowSize: WindowSizeModel = (this.route.snapshot.data as { windowSize: WindowSizeModel })
    .windowSize
  chatRoomListSize?: {
    height: number
    width: number
  }

  conversationSize?: {
    height: number
    width: number
  }

  textAreaSize?: {
    height: number
    width: number
  }

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  @Input() set recipientImport(recipient: string | undefined) {
    if (!recipient) return
    this.recipient = recipient
    this.userMessages$ = this.messagesStore.select.messagesWithUser$(recipient)
  }

  @Input() set selectChatroom(selectChatroom: SelectChatroomModel | undefined) {
    if (!selectChatroom) return
    if (selectChatroom.isGroup && selectChatroom.groupChatId) {
      this.groupChatCombined$ = this.groupChatsStore.select.groupChatById$(
        selectChatroom.groupChatId,
      )
      // groupChatById$
    }
    if (!selectChatroom.isGroup && selectChatroom.recipient) {
      this.recipient = selectChatroom.recipient
      this.userMessages$ = this.messagesStore.select.messagesWithUser$(selectChatroom.recipient)
    }
  }

  // SelectChatroomModel

  constructor(private _ngZone: NgZone /*, public dialogRef: MatDialogRef<ChatroomsComponent>*/) {
    /*    this.messagesStore.select.firstMessageOfEveryConversation$().subscribe(res => console.log(res))
        this.route.url.subscribe(res => console.log(res))
        console.log(this.route.snapshot.data)*/

    this.isDialog$.subscribe((res) => console.log(res))
    // const state = this.dialogRef.getState()
    // const state = this.dialogRef._containerInstance.()
    // const state = this.dialogRef.getState()
    // console.log('STATE', state)
    /*    if (this.dialogRef) {
          const state = this.dialogRef.getState()
          // const state = this.dialogRef._containerInstance.()
          // const state = this.dialogRef.getState()
          console.log(state)
        }*/
  }

  ngOnInit(): void {
    console.log()
    /*    if (!this.route.snapshot.data) return
        this.containerHeight = ((this.route.snapshot.data as any).windowSize as WindowSizeModel).innerHeight
        console.log(this.containerHeight)
        console.log(this.windowSize)
        if (!this.windowSize.innerHeight || !this.windowSize.innerWidth) return
        const heightMinusAppBar = this.windowSize.innerHeight - 64
        this.chatRoomListSize = {
          height: Math.floor(heightMinusAppBar),
          width: Math.floor(this.windowSize.innerWidth * 20 / 100),
        }
        this.conversationSize = {
          height: Math.floor(heightMinusAppBar * 80 / 100),
          width: Math.floor(this.windowSize.innerWidth * 80 / 100),
        }
        this.textAreaSize = {
          height: Math.floor(heightMinusAppBar * 20 / 100),
          width: Math.floor(this.windowSize.innerWidth * 80 / 100),
        }
        console.log(this.chatRoomListSize)
        console.log(this.conversationSize)
        console.log(this.textAreaSize)*/
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true))
  }

  change(event: MatSelectionListChange, username: string) {
    console.log(event)
    this.selectedMessage = event.options[0].value
    if (!this.selectedMessage) return
    this.recipient =
      this.selectedMessage.senderUsername === username
        ? this.selectedMessage.recipientUsername
        : this.selectedMessage.senderUsername
    if (this.recipient) {
      this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
      this.userMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
    }
    if (
      this.selectedMessage.status === NotificationStatus.Unread &&
      this.selectedMessage.senderUsername !== username
    ) {
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

  sendMessage() {
    if (!this.recipient) return
    if (!this.messageControl.value) return
    console.log(this.messageControl.value)
    const request: SendMessageRequest = {
      recipientUsername: this.recipient,
      content: this.messageControl.value,
    }
    this.messageControl.reset()
    this.messagesStore.dispatch.sendMessageToUser(request)
    /*    // console.log(this.viewport.nativeElement.scrollTop)
        console.log(this.viewport.nativeElement)
        this.viewport.nativeElement.scrollTop = this.viewport.nativeElement.scrollHeight - this.viewport.nativeElement.clientHeight
        this.eventBool = !this.eventBool*/
    // this.latestMessage = this.messageControl.value
  }

  markAllMessagesAsRead(messages: MessageModel[]) {
    if (!messages) return
    const unreadMessages = messages.filter(
      (message) => message.status === NotificationStatus.Unread,
    )
    if (!unreadMessages) return

    const updates: Update<MessageModel>[] = unreadMessages.map((notification) => {
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

    /*    const dialogConfig = {
          // disableClose: true,
          autoFocus: true,
          height: '800px',
          width: '1000px',
          data: {
            recipient,
          },
        } as MatDialogConfig*/
    /*   dialogConfig.data = {
         stringId: panel.stringId,
       }*/
    // this.dialog.open(ConversationComponent, dialogConfig)
  }

  selectMessage(message: MessageModel) {
    if (this.selectedConversationMessage && this.selectedConversationMessage.id === message.id) {
      this.selectedConversationMessage = undefined
      return
    }
    this.selectedConversationMessage = message
    return
  }

  calculateContainerHeight(messages: MessageModel[], viewport: CdkVirtualScrollViewport): string {
    // console.log(messages)
    const numberOfItems = messages.length

    const itemHeight = 25
    // 111

    const visibleItems = 22

    setTimeout(() => {
      viewport.checkViewportSize()
    }, 300)

    if (numberOfItems <= visibleItems) {
      return `${itemHeight * numberOfItems}px`
    }

    return `${itemHeight * visibleItems}px`
  }

  async toggleFullScreen() {
    this.dialog.closeAll()
    await this.router.navigateByUrl('messages')
  }

  getLastItem(message: MessageModel, messages: MessageModel[], index: number) {
    messages.sort((a: MessageModel, b: MessageModel) => {
      return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
    })
    console.log(messages[0])
    return messages[0].id === message.id
    /*    if (index == (messages.length - 1)) {
          // your code
          console.log(messages)
        }
        return index == (messages.length - 1)*/
    /*    if(index == (arr.length - 1)){
          // your code
        }
        const pop = messages.pop()
        console.log(pop)
        return message.id === pop?.id*/
  }
}
