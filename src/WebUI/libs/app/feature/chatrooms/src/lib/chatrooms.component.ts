import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

import { AuthUserModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable } from 'rxjs'

import { GroupChatConversationComponent } from './conversation/group-chat/group-chat-conversation.component'
import { ChatRoomListComponent } from './list/chat-room-list.component'
import { UserConversationComponent } from './conversation/user-conversation/user-conversation.component'
import { ChangeChatRoomDirective } from './change-chatroom.directive'
import { ChatRoomsService } from './services/chat-rooms.service'
import { NewChatRoomComponent } from './new-chat-room/new-chat-room.component'

@Component({
  selector: 'app-chatrooms-component',
  templateUrl: './chatrooms.component.html',
  styles: [],
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
    ChatRoomListComponent,
    GroupChatConversationComponent,
    UserConversationComponent,
    ChangeChatRoomDirective,
    NewChatRoomComponent,
  ],
  standalone: true,
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class ChatroomsComponent {
  private authStore = inject(AuthStoreService)
  private dialog = inject(MatDialog)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private chatRoomsService = inject(ChatRoomsService)
  private matDialogRef = inject(MatDialogRef<ChatroomsComponent>)
  height = window.innerHeight

  isCreatingGroupChat$ = this.chatRoomsService.creatingGroupChat$

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  chatRoomToMessage$ = this.chatRoomsService.chatRoomToMessage$

  createNewChat = false

  async toggleFullScreen() {
    this.dialog.closeAll()
    await this.router.navigateByUrl('messages')
  }

  createNewChatRoom() {
    this.createNewChat = true
  }
}
