import { DragDropModule } from '@angular/cdk/drag-drop'
import {
  AsyncPipe,
  NgClass,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
} from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core'

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

// import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'
import { LetDirective } from '@ngrx/component'
import { GroupChatCombinedModel, WebUserModel } from '@shared/data-access/models'
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

// import { UsersOverlayComponent } from '@app/feature/userName-profile'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ViewGroupChatMembersComponent } from '../group-chat/view-members/view-group-chat-members.component'
import { AddGroupChatMembersComponent } from '../group-chat/add-members/add-group-chat-members.component'
import { StartChatComponent } from './start-chat/start-chat.component'
import { GetCdnUrlStringPipe } from '@shared/pipes'

@Component({
  selector: 'app-message-options-bar-component',
  templateUrl: './message-options-bar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetDirective,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    MatButtonModule,
    MatIconModule,
    GetCdnUrlStringPipe,
  ],
  standalone: true,
})
export class MessageOptionsBarComponent {
  private router = inject(Router)
  private dialog = inject(MatDialog)
  // private dialogRef = inject(MatDialogRef<UsersOverlayComponent>)
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // private dialogRef: MatDialogRef<AppUserItemComponent>
  private _groupChat!: GroupChatCombinedModel
  private _webUser!: WebUserModel
  isGroup = false

  @Input() set groupChat(groupChat: GroupChatCombinedModel) {
    this._groupChat = groupChat
    this.isGroup = true
  }

  get groupChat() {
    return this._groupChat
  }

  @Input() set webUser(webUser: WebUserModel) {
    this._webUser = webUser
  }

  get webUser() {
    return this._webUser
  }

  // @Input() webUser!: WebUserModel

  openSettings(event: MouseEvent) {
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.openMenu()
  }

  // editChatRoomName() {}

  viewGroupChatMembers() {
    const dialogConfig = {
      autoFocus: true,
      /*      height: '400px',
            width: '600px',*/
      data: {
        groupChatName: this.groupChat.name,
        groupChatId: this.groupChat.id,
        groupChatPermissions: this.groupChat.permissions,
      },
    } as MatDialogConfig

    this.dialog.open(ViewGroupChatMembersComponent, dialogConfig)
  }

  addGroupChatMembers() {
    const dialogConfig = {
      autoFocus: true,
      /*      height: '400px',
            width: '600px',*/
      data: {
        groupChatName: this.groupChat.name,
        groupChatId: this.groupChat.id,
      },
    } as MatDialogConfig

    this.dialog.open(AddGroupChatMembersComponent, dialogConfig)
  }

  startGroupChatWithUser(webUser: WebUserModel) {
    const dialogConfig = {
      autoFocus: true,
      /*      height: '400px',
            width: '600px',*/
      data: {
        recipientUser: webUser,
      },
    } as MatDialogConfig

    this.dialog.open(StartChatComponent, dialogConfig)
    /*    const request: CreateGroupChatRequest = {
          groupChatName: this.webUser.userName,
          userNamesToInvite:
            this.selectedMembersToInvite.length > 0
              ? this.selectedMembersToInvite.map((m) => m.userName)
              : [],
        }
        this.groupChatsStore.dispatch.createGroupChat(request)*/
  }
}
