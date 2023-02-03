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

import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'

import { LetModule } from '@ngrx/component'
import { GroupChatCombinedModel, GroupChatMemberModel } from '@shared/data-access/models'
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'

import { UsernameProfileComponent } from '@app/feature/userName-profile'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { ViewGroupChatMembersComponent } from '../view-members/view-group-chat-members.component'
import { AddGroupChatMembersComponent } from '../add-members/add-group-chat-members.component'

@Component({
  selector: 'app-group-chat-options-bar-component',
  templateUrl: './group-chat-options-bar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DragDropModule,
    MatTooltipModule,
    NgStyle,
    NgIf,
    AsyncPipe,
    LetModule,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    PanelLinkComponent,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
})
export class GroupChatOptionsBarComponent {
  private router = inject(Router)
  private dialog = inject(MatDialog)
  private dialogRef = inject(MatDialogRef<UsernameProfileComponent>)
  menuTopLeftPosition = { x: '0', y: '0' }
  @ViewChild(MatMenuTrigger, { static: true })
  matMenuTrigger!: MatMenuTrigger
  // private dialogRef: MatDialogRef<ChangeDisplayPictureComponent>
  @Input() groupChat!: GroupChatCombinedModel

  openSettings(event: MouseEvent) {
    this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
    this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
    this.matMenuTrigger.openMenu()
  }

  editChatRoomName() {}

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
}