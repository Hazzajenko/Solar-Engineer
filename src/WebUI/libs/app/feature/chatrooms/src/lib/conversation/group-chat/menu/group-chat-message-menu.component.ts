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

import { LetDirective } from '@ngrx/component'
import { GroupChatMessageMemberModel, TypeOfUser } from '@shared/data-access/models'
import { Router } from '@angular/router'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

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
    LetDirective,
    MatMenuModule,
    NgTemplateOutlet,
    NgClass,
    NgSwitch,
    NgSwitchCase,
  ],
  standalone: true,
})
export class GroupChatMessageMenuComponent {
  private router = inject(Router)
  private dialog = inject(MatDialog)
  // private dialogRef = inject(MatDialogRef<UsersOverlayComponent>)
  // private dialogRef: MatDialogRef<AppUserItemComponent>
  @Input() message!: GroupChatMessageMemberModel

  async routeToUserProfile(user: TypeOfUser) {
    // await this.router.navigateByUrl(`user/${sender.userName}`)
    const dialogConfig = {
      autoFocus: true,
      /*      height: '400px',
            width: '600px',*/
      data: {
        user,
      },
    } as MatDialogConfig

    // this.dialog.open(UsersOverlayComponent, dialogConfig)
    /*
        this.dialogRef
          .afterClosed()
          .pipe
          /!*        first(),
                    map((data) => data),*!/
          ()
          .subscribe((res) => console.log(res))*/
  }

  sendFriendRequest(sender: TypeOfUser) {
    // console.log(sender)
  }

  messagePrivately(sender: TypeOfUser) {
    // console.log(sender)
  }
}
