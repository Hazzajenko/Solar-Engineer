import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { AuthStoreService } from '@auth/data-access/facades'
import { Update } from '@ngrx/entity'

import {
  MessageModel,
  NotificationModel,
  NotificationStatus,
  UserModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { Observable } from 'rxjs'
import { MessagesStoreService, SendMessageRequest } from '../../data-access'
import { ConversationMessageDirective } from './conversation-message.directive'
import { ScrollViewportDirective } from './scroll-viewport.directive'
import { SortConversationMessagesPipe } from './sort-conversation-messages.pipe'

@Component({
  selector: 'app-conversation-component',
  templateUrl: './conversation.component.html',
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

      /*    *::-webkit-scrollbar-track {
          background: #71b1d8;
        }

        *::-webkit-scrollbar-thumb {
          background-color: blue;
          border-radius: 20px;
          border: 3px solid #3e8bf5;
        }*/
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
    ConversationMessageDirective,
    SortConversationMessagesPipe,
    ScrollViewportDirective,
  ],
  standalone: true,
})
export class ConversationComponent implements OnInit {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  /*  @ViewChild('viewport', { static: false }) viewport!: ElementRef<HTMLElement>*/

  messages$?: Observable<MessageModel[]>
  // messages$: Observable<MessageModel[]> = this.messagesStore.select.messages$
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedMessage?: MessageModel
  unreadFilter = false
  recipient?: string
  eventBool = false
  // message = ''
  messageControl = new FormControl('', [])
  latestMessage?: string
  scrollIndex = 0
  @ViewChild('viewport', { static: false }) scrollFrame!: ElementRef
  @ViewChildren('viewItem') itemElements!: QueryList<any>

  private scrollContainer: any
  private items = []
  private isNearBottom = true

  constructor(
    private dialogRef: MatDialogRef<ConversationComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.recipient = data.recipient
  }

  /*
    ngAfterViewInit() {
      this.scrollContainer = this.scrollFrame.nativeElement
      this.itemElements.changes.subscribe(_ => this.onItemElementsChanged())
      /!*
          // Add a new item every 2 seconds
          setInterval(() => {
            this.items.push({})
          }, 2000)*!/
    }*/

  ngOnInit() {
    if (this.recipient) {
      // this.messagesStore.dispatch.initMessagesWithUser(this.recipient)
      // this.messages$ = this.messagesStore.select.messagesWithUser$(this.recipient)
    }
  }

  sendMessage() {
    if (!this.recipient) return
    if (!this.messageControl.value) return
    console.log(this.messageControl.value)
    const request: SendMessageRequest = {
      recipientUsername: this.recipient,
      content: this.messageControl.value,
    }
    // this.messagesStore.dispatch.sendMessageToUser(request)
    /*    // console.log(this.viewport.nativeElement.scrollTop)
        console.log(this.viewport.nativeElement)
        this.viewport.nativeElement.scrollTop = this.viewport.nativeElement.scrollHeight - this.viewport.nativeElement.clientHeight
        this.eventBool = !this.eventBool*/
    this.latestMessage = this.messageControl.value
  }

  /*
    private onItemElementsChanged(): void {
      if (this.isNearBottom) {
        this.scrollToBottom()
      }
    }

    private scrollToBottom(): void {
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        left: 0,
        behavior: 'smooth',
      })
    }

    private isUserNearBottom(): boolean {
      const threshold = 150
      const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight
      const height = this.scrollContainer.scrollHeight
      return position > height - threshold
    }


    scrolled(event: any): void {
      this.isNearBottom = this.isUserNearBottom()
    }*/
  scrollIndexChanged(event: number) {
    this.scrollIndex = event
    console.log(event)
  }
}
