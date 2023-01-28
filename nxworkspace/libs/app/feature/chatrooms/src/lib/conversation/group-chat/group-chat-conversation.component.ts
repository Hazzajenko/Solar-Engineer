import { ScrollingModule } from '@angular/cdk/scrolling'
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
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { ActivatedRoute } from '@angular/router'
import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access/facades'
import { LetModule } from '@ngrx/component'

import {
  GroupChatCombinedModel,
  GroupChatMemberModel,
  GroupChatMessageMemberModel,
  GroupChatMessageModel,
  MessageTimeSortModel,
  UserModel,
} from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable } from 'rxjs'
import { GroupChatsStoreService, SendGroupChatMessageRequest } from '@app/data-access/group-chats'

import { ExcludeUserFromSeenPipe } from './pipes/exclude-user-from-seen.pipe'

import { AnyGroupMessageSeenPipe } from './pipes/any-group-message-seen.pipe'
import { MessageBarComponent } from '../message-bar/message-bar.component'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { GroupChatMessageMenuComponent } from './menu/group-chat-message-menu.component'
import { ConversationMessageDirective, ScrollViewportDirective } from '@shared/directives'

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

      .material-symbols-outlined {
        font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 200, 'opsz' 20;
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
    ExcludeUserFromSeenPipe,
    AnyGroupMessageSeenPipe,
    MessageBarComponent,
    MatMenuModule,
    GroupChatMessageMenuComponent,
    ConversationMessageDirective,
    ScrollViewportDirective,
  ],
  standalone: true,
})
export class GroupChatConversationComponent {
  private authStore = inject(AuthStoreService)
  private route = inject(ActivatedRoute)
  private groupChatsStore = inject(GroupChatsStoreService)

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )

  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger

  groupChatCombined$!: Observable<GroupChatCombinedModel | undefined>
  groupChatMessages$!: Observable<GroupChatMessageModel[] | undefined>
  groupChatMembers$!: Observable<GroupChatMemberModel[]>
  groupChatMessagesWithMembersById$!: Observable<GroupChatMessageMemberModel[]>
  user$: Observable<UserModel | undefined> = this.authStore.select.user$
  selectedGroupChatMessage?: GroupChatMessageMemberModel
  unreadFilter = false
  scrollIndex = 0

  groupChatId = 0

  @Input() set selectChatroom(selectChatroom: MessageTimeSortModel | undefined) {
    console.log(selectChatroom)
    if (!selectChatroom) return
    if (!selectChatroom.isGroup || !selectChatroom.groupChat) return
    this.groupChatsStore.select
      .groupChatById$(selectChatroom.groupChat.id)
      .subscribe((res) => console.log(res))
    this.groupChatId = selectChatroom.groupChat.id
    this.groupChatCombined$ = this.groupChatsStore.select.groupChatById$(
      selectChatroom.groupChat.id,
    )
    this.groupChatCombined$.subscribe((res) => console.log(res))
    this.groupChatMessages$ = this.groupChatsStore.select.groupChatMessagesById$(
      selectChatroom.groupChat.id,
    )
    this.groupChatMembers$ = this.groupChatsStore.select.groupChatMembersById$(
      selectChatroom.groupChat.id,
    )
    this.groupChatMessagesWithMembersById$ =
      this.groupChatsStore.select.groupChatMessagesWithMembersById$(selectChatroom.groupChat.id)
  }

  sendGroupChatMessage(message: string) {
    const request: SendGroupChatMessageRequest = {
      groupChatId: this.groupChatId,
      content: message,
    }
    this.groupChatsStore.dispatch.sendMessageToGroupChat(request)
  }

  selectGroupChatMessage(message: GroupChatMessageMemberModel) {
    if (this.selectedGroupChatMessage && this.selectedGroupChatMessage.id === message.id) {
      this.selectedGroupChatMessage = undefined
      return
    }
    this.selectedGroupChatMessage = message
    return
  }

  onRightClick(event: MouseEvent, message: GroupChatMessageMemberModel) {
    event.preventDefault()
    this.selectedGroupChatMessage = message
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.menuData = { message }
    this.matMenuTrigger.openMenu()
  }
}
