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
} from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'

import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
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
  MessageModel,
  MessageTimeSortModel,
  NotificationModel,
  NotificationStatus,
  UserModel,
  WindowSizeModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { filter, map, Observable, startWith, switchMap, take } from 'rxjs'

import { MessageDirective } from '../../../../../messages/src/lib/feature/component/message.directive'
import { SortMessagesPipe } from '../../../../../messages/src/lib/feature/component/sort-messages.pipe'
import { ConversationMessageDirective } from '../../../../../messages/src/lib/feature/conversation/conversation-message.directive'
import { ScrollViewportDirective } from '../../../../../messages/src/lib/feature/conversation/scroll-viewport.directive'
import { SortConversationMessagesPipe } from '../../../../../messages/src/lib/feature/conversation/sort-conversation-messages.pipe'
import { GroupChatsStoreService } from '@app/data-access/group-chats'
import { ChatroomsService } from '../chatrooms.service'

@Component({
  selector: 'app-chatroom-list-component',
  templateUrl: './chatroom-list.component.html',
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
    MatAutocompleteModule,
  ],
  standalone: true,
})
export class ChatroomListComponent implements OnInit {
  @Output() selectMessageEvent = new EventEmitter<string>()
  @Output() selectGroupChatEvent = new EventEmitter<number>()
  @Output() selectChatRoomEvent = new EventEmitter<MessageTimeSortModel>()
  conversationMessages$?: Observable<MessageModel[] | undefined>

  filteredMessages$?: Observable<string[] | undefined>
  control = new FormControl('')
  selectedMessage?: MessageModel
  selectedChatroom?: MessageTimeSortModel
  selectedConversationMessage?: MessageModel
  unreadFilter = false
  recipient?: string
  chatroom?: string
  messageControl = new FormControl('', [])
  scrollIndex = 0
  containerHeight?: number
  containerWidth?: number
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
  private messagesStore = inject(MessagesStoreService)
  messages$: Observable<MessageModel[] | undefined> =
    this.messagesStore.select.firstMessageOfEveryConversation$()
  private groupChatsStore = inject(GroupChatsStoreService)
  groupChats$ = this.groupChatsStore.select.groupChatsWithLatestMessage$
  private authStore = inject(AuthStoreService)
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  private chatroomsService = inject(ChatroomsService)
  chatrooms$: Observable<MessageTimeSortModel[]> =
    this.chatroomsService.getCombinedUserMessagesAndGroupChats$()
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  // public dialogRef!: MatDialogRef<ChatroomsComponent>

  firstMessageSenders$ = this.user$.pipe(
    map((user) => user?.username),
    switchMap(
      (username) =>
        this.messages$.pipe(
          map((messages) =>
            messages?.map((message) => {
              if (message.senderUsername !== username) {
                return message.senderUsername
              }
              return message.recipientUsername
            }),
          ),
        ) /*.pipe(
      map(firstSenders => {
        const
      }
      )
    )*/,
    ),
  )
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  windowSize: WindowSizeModel = (this.route.snapshot.data as { windowSize: WindowSizeModel })
    .windowSize
  private formBuilder = inject(FormBuilder)
  messageForm = this.formBuilder.group({
    messageForm: '',
  })

  constructor(private _ngZone: NgZone /*, public dialogRef: MatDialogRef<ChatroomsComponent>*/) {
    /*    this.messagesStore.select.firstMessageOfEveryConversation$().subscribe(res => console.log(res))
        this.route.url.subscribe(res => console.log(res))
        console.log(this.route.snapshot.data)*/

    this.isDialog$.subscribe((res) => console.log(res))
    this.firstMessageSenders$.subscribe((res) => console.log(res))
    this.groupChatsStore.select.groupChatsWithLatestMessage$.subscribe((res) =>
      console.log('RESRES', res),
    )

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
    this.filteredMessages$ = this.control.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter2(value || '')),
    )
    this.filteredMessages$.subscribe((res) => console.log(res))
    this.groupChats$.subscribe((res) => console.log('GROUPCHATS', res))
    this.chatrooms$.subscribe((res) => console.log('chatrooms$', res))
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
    this.selectedChatroom = event.options[0].value
    // this.selectedMessage = event.options[0].value
    if (!this.selectedChatroom) return
    if (this.selectedChatroom.isGroup) {
      // if (!this.selectedChatroom.groupChat) return
      this.selectGroupChat(this.selectedChatroom, username)
      // this.chatroom = this.selectedChatroom.groupChat.name
    } else {
      // if (!this.selectedChatroom.message) return console.error('!this.selectedChatroom.message')
      this.selectUserMessage(this.selectedChatroom, username)
      // this.recipient =
      //   this.selectedChatroom.message.senderUsername === username
      //     ? this.selectedChatroom.message.recipientUsername
      //     : this.selectedChatroom.message.senderUsername
    }
    // this.recipient = this.selectedMessage.senderUsername === username ? this.selectedMessage.recipientUsername : this.selectedMessage.senderUsername
    /*    if (this.recipient) {
          this.selectMessageEvent.emit(this.recipient)
          this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
          this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
        }
        if (
          this.selectedMessage.status === NotificationStatus.Unread &&
          this.selectedMessage.senderUsername !== username
        ) {
          this.readMessage(selectedChatroom.message)
        }*/
  }

  selectUserMessage(selectedChatroom: MessageTimeSortModel, username: string) {
    if (!selectedChatroom.message) return console.error('!this.selectedChatroom.message')
    this.recipient =
      selectedChatroom.message.senderUsername === username
        ? selectedChatroom.message.recipientUsername
        : selectedChatroom.message.senderUsername
    // this.selectMessageEvent.emit(this.recipient)
    this.selectChatRoomEvent.emit(selectedChatroom)
    this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
    if (
      selectedChatroom.message.status === NotificationStatus.Unread &&
      selectedChatroom.message.senderUsername !== username
    ) {
      this.readMessage(selectedChatroom.message)
    }
    // this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
  }

  selectGroupChat(selectedChatroom: MessageTimeSortModel, username: string) {
    if (!selectedChatroom.groupChat) return console.error('!this.selectedChatroom.message')
    /*    this.recipient =
          selectedChatroom.groupChat.senderUsername === username
            ? selectedChatroom.groupChat.recipientUsername
            : selectedChatroom.groupChat.senderUsername*/
    // this.selectGroupChatEvent.emit(selectedChatroom.groupChat.id)
    this.selectChatRoomEvent.emit(selectedChatroom)
    this.groupChatsStore.dispatch.initGroupChat(selectedChatroom.groupChat.id)
    /*    if (
          selectedChatroom.message.status === NotificationStatus.Unread &&
          selectedChatroom.message.senderUsername !== username
        ) {
          this.readMessage(selectedChatroom.message)
        }
        // this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)*/
  }

  readMessage(message: MessageModel) {
    const update: Update<NotificationModel> = {
      id: message.id,
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
    this.selectedConversationMessage = message
  }

  async toggleFullScreen() {
    this.dialog.closeAll()
    await this.router.navigateByUrl('messages')
  }

  displayFn(username: string | undefined): string {
    return username ? username : ''
  }

  /*  private _filterGroup(value: string) {
      if (value) {
        return this.firstMessageSenders$.pipe(
          map(group => ({ letter: group.letter, names: _filter(group.names, value) })),
          filter(group => group.names.length > 0),
        )
      }

      return this.firstMessageSenders$
    }*/
  openConversationFromSearch(
    event: MatAutocompleteSelectedEvent,
    username: string,
    messages: MessageModel[],
  ) {
    console.log(event, username)
    this.recipient = event.option.value
    if (!this.recipient) return
    const message = messages.find(
      (message) =>
        message.recipientUsername === this.recipient || message.senderUsername === this.recipient,
    )
    if (!message) return
    this.selectedMessage = message

    this.selectMessageEvent.emit(this.recipient)
    this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
    this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
  }

  /*  private _filter2(value: string): string[] {
      const filterValue = value.toLowerCase()


      return this.options.filter(option => option.toLowerCase().includes(filterValue))
    }*/

  private _filter2(username: string): Observable<string[] | undefined> {
    const filterValue = username.toLowerCase()

    return this.firstMessageSenders$.pipe(
      map((usernames) => usernames?.filter((option) => option.toLowerCase().includes(filterValue))),
    )
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value)
    return this.firstMessageSenders$.pipe(
      filter((street) => this._normalizeValue(`${street}`).includes(filterValue)),
    )
  }

  private _normalizeValue(value: string) {
    // if (!value) return undefined
    return value.toLowerCase().replace(/\s/g, '')
  }
}
