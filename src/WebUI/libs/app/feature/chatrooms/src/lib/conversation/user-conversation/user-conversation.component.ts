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
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, ViewChild } from '@angular/core'

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
// import { MessagesComponent } from '@app/messages'
import { SendMessageRequest, UserMessagesStoreService } from '@app/data-access/messages'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

import { AuthUserModel, MessageFrom, MessageWebUserModel, WebUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable } from 'rxjs'

import { ConversationMessageDirective, ScrollViewportDirective } from '@shared/directives'
import { MessageBarComponent } from '../message-bar/message-bar.component'
import { GetCdnUrlStringPipe, SortConversationMessagesPipe, YouOrUserNamePipe } from '@shared/pipes'
import { MessageItemComponent } from '../message-item/message-item.component'
import { MessageOptionsBarComponent } from '../options-bar/message-options-bar.component'
import { UsersStoreService } from '@app/data-access/users'

// import { UserMessagesStoreService } from '@app/data-access/messages'

@Component({
  selector: 'app-user-conversation-component',
  templateUrl: './user-conversation.component.html',
  styles: [
    `
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
    LetDirective,
    // MessagesComponent,

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
export class UserConversationComponent implements AfterViewInit {
  private messagesStore = inject(UserMessagesStoreService)
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private usersStore = inject(UsersStoreService)
  private elementRef = inject(ElementRef)
  readonly MessageFrom = MessageFrom

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )

  userMessages$?: Observable<MessageWebUserModel[]>
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  selectedConversationMessage?: MessageWebUserModel
  unreadFilter = false
  recipient?: string
  recipientUser$?: Observable<WebUserModel>
  scrollIndex = 0
  elDistanceToTop = 0
  elDistanceToBottom = 0
  element!: any
  yPosition = 0
  idk = 0

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  @Input() set recipientImport(recipient: string | undefined) {
    if (!recipient) return
    this.recipient = recipient
    // this.userMessages$ = this.messagesStore.select.messagesWithUser2$(recipient)
    this.userMessages$ = this.messagesStore.select.messagesWithUser$(recipient)
    this.recipientUser$ = this.usersStore.select.webUserCombinedByUserName$(recipient)
  }

  ngAfterViewInit() {
    this.elDistanceToTop =
      window.pageYOffset + this.elementRef.nativeElement.getBoundingClientRect().top
    /*    this.elDistanceToTop =
     window.pageYOffset +
     this.elementRef.nativeElement.getBoundingClientRect().top -
     this.elementRef.nativeElement.offsetTop*/
    if (this.elementRef.nativeElement.offsetParent) {
      this.idk =
        this.elementRef.nativeElement.getBoundingClientRect().top +
        this.elementRef.nativeElement.offsetParent
    }
    this.element = this.elementRef
    while (this.element) {
      //   xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      this.yPosition += this.element.offsetTop - this.element.scrollTop + this.element.clientTop
      this.element = this.element.offsetParent
    }

    // return { x: xPosition, y: yPosition };
    // this.elDistanceToTop = window.innerHeight / 2
    this.elDistanceToBottom =
      window.pageYOffset + this.elementRef.nativeElement.getBoundingClientRect().bottom
  }

  sendMessage(message: string) {
    if (!this.recipient) return

    const request: SendMessageRequest = {
      recipientUserId: this.recipient,
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
