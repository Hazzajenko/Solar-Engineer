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
import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MessagesComponent } from '@app/messages'
import { LetModule } from '@ngrx/component'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { MessageDirective } from '../../../../../../messages/src/lib/feature/component/message.directive'
import { SortMessagesPipe } from '../../../../../../messages/src/lib/feature/component/sort-messages.pipe'
import { ConversationMessageDirective } from '../../../../../../messages/src/lib/feature/conversation/conversation-message.directive'
import { ScrollViewportDirective } from '../../../../../../messages/src/lib/feature/conversation/scroll-viewport.directive'
import { SortConversationMessagesPipe } from '../../../../../../messages/src/lib/feature/conversation/sort-conversation-messages.pipe'
import { IsLastMessagePipe } from '../../is-last-message.pipe'
import { LastMessageIdPipe } from '../../last-message-id.pipe'

@Component({
  selector: 'app-message-bar-component',
  templateUrl: './message-bar.component.html',
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
export class MessageBarComponent {
  messageControl = new FormControl('', [])
  @Output() sendMessageEvent = new EventEmitter<string>()

  @ViewChild('autosize') autosize!: CdkTextareaAutosize

  sendGroupChatMessage() {
    if (!this.messageControl.value) return
    this.sendMessageEvent.emit(this.messageControl.value)
    this.messageControl.reset()
  }
}
