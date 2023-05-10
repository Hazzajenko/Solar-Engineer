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
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule, MatSelectionListChange } from '@angular/material/list'
import { ActivatedRoute } from '@angular/router'
// import { MessagesComponent } from '@app/messages'
import { AuthStoreService } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

import { MessageTimeSortModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { map, Observable, startWith, switchMap } from 'rxjs'

import { ChatRoomsService } from '../services/chat-rooms.service'
import { SortChatroomsPipe } from './sort-chatrooms.pipe'
import { SortConversationMessagesPipe, TruncatePipe } from '@shared/pipes'
import { GroupChatMemberItemComponent } from '../conversation/member-item/group-chat-member-item.component'
import { MatMenuModule } from '@angular/material/menu'
import { ConversationMessageDirective, ScrollViewportDirective } from '@shared/directives'

@Component({
  selector: 'app-chatroom-list-component',
  templateUrl: './chat-room-list.component.html',
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
    // MessageDirective,
    // SortMessagesPipe,
    ScrollViewportDirective,
    ConversationMessageDirective,
    SortConversationMessagesPipe,
    MatAutocompleteModule,
    SortChatroomsPipe,
    TruncatePipe,
    GroupChatMemberItemComponent,
    MatMenuModule,
  ],
  standalone: true,
})
export class ChatRoomListComponent implements OnInit {
  private chatRoomsService = inject(ChatRoomsService)
  private authStore = inject(AuthStoreService)
  private route = inject(ActivatedRoute)

  filteredChatRooms$?: Observable<MessageTimeSortModel[] | undefined>
  autoCompleteControl = new FormControl('')
  unreadFilter = false
  user$ = this.authStore.select.user$

  chatrooms$: Observable<MessageTimeSortModel[]> =
    this.chatRoomsService.combinedUserMessagesAndGroupChats$

  chatRoomToMessage$ = this.chatRoomsService.chatRoomToMessage$

  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )

  autoCompleteDisplayFunc(chatRoom: MessageTimeSortModel): string {
    return chatRoom && chatRoom.chatRoomName ? chatRoom.chatRoomName : ''
  }

  ngOnInit(): void {
    this.filteredChatRooms$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this.filterChatRooms(value || '')),
    )
  }

  change(event: MatSelectionListChange) {
    const chatRoom = event.options[0].value as MessageTimeSortModel
    if (!chatRoom) return
    this.chatRoomsService.setChatRoomToMessage(chatRoom)
    this.chatRoomsService.toggleCreatingGroupChat(false)
  }

  openConversationFromSearch(event: MatAutocompleteSelectedEvent) {
    const chatroom = event.option.value as MessageTimeSortModel
    if (!chatroom) return
    this.chatRoomsService.toggleCreatingGroupChat(false)
    return this.chatRoomsService.setChatRoomToMessage(chatroom)
  }

  private filterChatRooms(query: string): Observable<MessageTimeSortModel[] | undefined> {
    const filterValue = query.toLowerCase()

    return this.chatrooms$.pipe(
      map((data) =>
        data.filter((search) => search.chatRoomName.toLowerCase().includes(filterValue)),
      ),
    )
  }

  creatingGroupChat() {
    this.chatRoomsService.toggleCreatingGroupChat(true)
  }
}
