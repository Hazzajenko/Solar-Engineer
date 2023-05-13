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
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Inject,
  inject,
  Input,
  ViewContainerRef,
} from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { UserConversationComponent } from '../../../chatrooms/src/lib/conversation/user-conversation/user-conversation.component'
import { GroupChatConversationComponent } from '../../../chatrooms/src/lib/conversation/group-chat/group-chat-conversation.component'
import { DialogRouterDirective } from './dialog-router.directive'
import { DialogRouteType } from './dialog.routes'

@Component({
  selector: 'app-main-dialog-component',
  templateUrl: './main-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,

    ScrollingModule,
    NgIf,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,

    NgClass,
    MatCardModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,
    MatCheckboxModule,
    DialogRouterDirective,
  ],
  standalone: true,
})
export class MainDialogComponent {
  private dialog = inject(MatDialog)
  private viewContainerRef = inject(ViewContainerRef)
  // private _route?: string
  route?: DialogRouteType
  // route?: string

  // constructor(public viewContainerRef: ViewContainerRef) {}

  userConversationRef?: ComponentRef<UserConversationComponent>
  routeComponentRef?: ComponentRef<any>

  constructor(
    private dialogRef: MatDialogRef<MainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { route: DialogRouteType },
  ) {
    this.route = data.route
  }

  /*
    set route(route: DialogRouteType) {
      if (!route) return
      const _viewContainerRef = this.viewContainerRef

      _viewContainerRef.clear()
      this.routeComponentRef = _viewContainerRef.createComponent(route.AppUserProfileRoute)
    }*/
}
