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
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'

import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'

import { PanelLinkComponent } from '@grid-layout/feature/blocks/shared-ui'

import { LetModule } from '@ngrx/component'
import { GroupChatMemberModel, GroupChatMessageMemberModel } from '@shared/data-access/models'
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'

import { UsernameProfileComponent } from '@app/feature/userName-profile'

@Component({
  selector: 'app-group-chat-message-menu-component',
  templateUrl: './group-chat-message-menu.component.html',
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
  ],
  standalone: true,
})
export class GroupChatMessageMenuComponent {
  private router = inject(Router)
  private dialog = inject(MatDialog)
  private dialogRef = inject(MatDialogRef<UsernameProfileComponent>)
  // private dialogRef: MatDialogRef<UsernameProfileComponent>
  @Input() message!: GroupChatMessageMemberModel

  async routeToUserProfile(user: GroupChatMemberModel) {
    // await this.router.navigateByUrl(`user/${sender.userName}`)
    const dialogConfig = {
      autoFocus: true,
      /*      height: '400px',
            width: '600px',*/
      data: {
        user,
      },
    } as MatDialogConfig

    this.dialog.open(UsernameProfileComponent, dialogConfig)

    this.dialogRef
      .afterClosed()
      .pipe
      /*        first(),
                map((data) => data),*/
      ()
      .subscribe((res) => console.log(res))
  }
}
