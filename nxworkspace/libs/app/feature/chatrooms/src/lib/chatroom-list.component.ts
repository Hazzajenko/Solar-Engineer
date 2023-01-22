import { ScrollingModule } from '@angular/cdk/scrolling'
import { CdkTextareaAutosize } from '@angular/cdk/text-field'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
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
  NotificationModel,
  NotificationStatus,
  UserModel,
  WindowSizeModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { filter, map, Observable, startWith, switchMap, take } from 'rxjs'

import { MessageDirective } from '../../../../messages/src/lib/feature/component/message.directive'
import { SortMessagesPipe } from '../../../../messages/src/lib/feature/component/sort-messages.pipe'
import {
  ConversationMessageDirective,
} from '../../../../messages/src/lib/feature/conversation/conversation-message.directive'
import { ScrollViewportDirective } from '../../../../messages/src/lib/feature/conversation/scroll-viewport.directive'
import {
  SortConversationMessagesPipe,
} from '../../../../messages/src/lib/feature/conversation/sort-conversation-messages.pipe'


@Component({
  selector: 'app-chatroom-list-component',
  templateUrl: './chatroom-list.component.html',
  styles: [`
    html,
    body {
      height: 100%;
      width: 100%;
      margin: 0px;
      padding: 0px;
      overflow: hidden;
    }
  `],
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

  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private formBuilder = inject(FormBuilder)

  @Output() selectMessageEvent = new EventEmitter<string>()

  // public dialogRef!: MatDialogRef<ChatroomsComponent>
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  messages$: Observable<MessageModel[] | undefined> = this.messagesStore.select.firstMessageOfEveryConversation$()

  conversationMessages$?: Observable<MessageModel[] | undefined>
  user$: Observable<UserModel | undefined> = this.authStore.select.user$

  firstMessageSenders$ = this.user$.pipe(
    map(user => user?.username),
    switchMap(username => this.messages$.pipe(
      map(messages => messages?.map(message => {
          if (message.senderUsername !== username) {
            return message.senderUsername
          }
          return message.recipientUsername
        }),
      ),
    )/*.pipe(
      map(firstSenders => {
        const
      }
      )
    )*/),
  )

  filteredMessages$?: Observable<string[] | undefined>
  control = new FormControl('')
  selectedMessage?: MessageModel
  selectedConversationMessage?: MessageModel
  unreadFilter = false
  recipient?: string
  messageControl = new FormControl('', [])
  scrollIndex = 0
  containerHeight?: number
  containerWidth?: number
  windowSize: WindowSizeModel = (this.route.snapshot.data as { windowSize: WindowSizeModel }).windowSize
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

  messageForm = this.formBuilder.group({
    messageForm: '',
  })

  @ViewChild('autosize') autosize!: CdkTextareaAutosize


  constructor(private _ngZone: NgZone/*, public dialogRef: MatDialogRef<ChatroomsComponent>*/) {
    /*    this.messagesStore.select.firstMessageOfEveryConversation$().subscribe(res => console.log(res))
        this.route.url.subscribe(res => console.log(res))
        console.log(this.route.snapshot.data)*/

    this.isDialog$.subscribe(res => console.log(res))
    this.firstMessageSenders$.subscribe(res => console.log(res))
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
      switchMap(value => this._filter2(value || '')),
    )
    this.filteredMessages$.subscribe(res => console.log(res))
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
    this.recipient = this.selectedMessage.senderUsername === username ? this.selectedMessage.recipientUsername : this.selectedMessage.senderUsername
    if (this.recipient) {
      this.selectMessageEvent.emit(this.recipient)
      this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
      this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
    }
    if (this.selectedMessage.status === NotificationStatus.Unread && this.selectedMessage.senderUsername !== username) {
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

  private _filter2(username: string): Observable<string[] | undefined> {
    const filterValue = username.toLowerCase()

    return this.firstMessageSenders$.pipe(
      map(usernames => usernames?.filter(option => option.toLowerCase().includes(filterValue))),
    )
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value)
    return this.firstMessageSenders$.pipe(
      filter(street => this._normalizeValue(`${street}`).includes(filterValue)),
    )
  }

  /*  private _filter2(value: string): string[] {
      const filterValue = value.toLowerCase()


      return this.options.filter(option => option.toLowerCase().includes(filterValue))
    }*/

  displayFn(username: string | undefined): string {
    return username ? username : ''
  }

  private _normalizeValue(value: string) {
    // if (!value) return undefined
    return value.toLowerCase().replace(/\s/g, '')
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
  openConversationFromSearch(event: MatAutocompleteSelectedEvent, username: string, messages: MessageModel[]) {

    console.log(event, username)
    this.recipient = event.option.value
    if (!this.recipient) return
    const message = messages.find(message => message.recipientUsername === this.recipient || message.senderUsername === this.recipient)
    if (!message) return
    this.selectedMessage = message

    this.selectMessageEvent.emit(this.recipient)
    this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
    this.conversationMessages$ = this.messagesStore.select.messagesWithUser$(this.recipient)

  }
}

