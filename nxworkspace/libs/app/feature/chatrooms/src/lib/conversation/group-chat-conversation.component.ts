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
  MessageTimeSortModel,
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
import { GroupChatsStoreService, SendGroupChatMessageRequest } from '@app/data-access/group-chats'
import { SortGroupChatMessagesPipe } from './sort-group-chat-messages.pipe'
import { LastGroupChatMessageIdPipe } from './last-group-chat-message-id.pipe'

@Component({
  selector: 'app-group-chat-conversation-component',
  templateUrl: './group-chat-conversation.component.html',
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
    SortGroupChatMessagesPipe,
    LastGroupChatMessageIdPipe,
  ],
  standalone: true,
})
export class GroupChatConversationComponent implements OnInit {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private route = inject(ActivatedRoute)
  private groupChatsStore = inject(GroupChatsStoreService)

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )

  groupChatCombined$!: Observable<GroupChatCombinedModel | undefined>
  groupChatMessages$!: Observable<GroupChatMessageModel[] | undefined>
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedGroupChatMessage?: GroupChatMessageModel
  unreadFilter = false
  messageControl = new FormControl('', [])
  scrollIndex = 0

  groupChatId = 0

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  @Input() set selectChatroom(selectChatroom: MessageTimeSortModel | undefined) {
    console.log(selectChatroom)
    if (!selectChatroom) return
    if (!selectChatroom.isGroup || !selectChatroom.groupChat) return
    this.groupChatId = selectChatroom.groupChat.id
    this.groupChatCombined$ = this.groupChatsStore.select.groupChatById$(
      selectChatroom.groupChat.id,
    )
    this.groupChatMessages$ = this.groupChatsStore.select.groupChatMessagesById$(
      selectChatroom.groupChat.id,
    )
    // groupChatMessagesById$
    // this.groupChatCombined$.subscribe((res) => console.log(res))
    // this.isGroup = true
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

  sendGroupChatMessage() {
    // if (!this.recipient) return
    if (!this.messageControl.value) return
    console.log(this.messageControl.value)
    const request: SendGroupChatMessageRequest = {
      groupChatId: this.groupChatId,
      content: this.messageControl.value,
    }
    this.messageControl.reset()
    this.groupChatsStore.dispatch.sendMessageToGroupChat(request)
  }

  selectGroupChatMessage(message: GroupChatMessageModel) {
    if (this.selectedGroupChatMessage && this.selectedGroupChatMessage.id === message.id) {
      this.selectedGroupChatMessage = undefined
      return
    }
    this.selectedGroupChatMessage = message
    return
  }
}
