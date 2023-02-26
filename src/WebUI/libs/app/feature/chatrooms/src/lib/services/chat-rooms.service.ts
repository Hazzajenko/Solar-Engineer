import { inject, Injectable } from '@angular/core'
import { UserMessagesStoreService } from '@app/data-access/messages'
import { GroupChatsStoreService } from '@app/data-access/group-chats'
import { BehaviorSubject, combineLatest, map } from 'rxjs'
import { MessageTimeSortModel } from '@shared/data-access/models'
import { AuthStoreService } from '@auth/data-access/facades'

@Injectable({
  providedIn: 'root',
})
export class ChatRoomsService {
  private messagesStore = inject(UserMessagesStoreService)
  private authStore = inject(AuthStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)
  private _chatRoomToMessage$ = new BehaviorSubject<MessageTimeSortModel | undefined>(undefined)
  private _creatingGroupChat$ = new BehaviorSubject<boolean>(false)
  chatRoomToMessage$ = this._chatRoomToMessage$.asObservable()
  creatingGroupChat$ = this._creatingGroupChat$.asObservable()

  combinedUserMessagesAndGroupChats$ = combineLatest([
    this.messagesStore.select.latestUserMessages$,
    this.groupChatsStore.select.groupChatsWithLatestMessage$,
  ]).pipe(
    map(([messages, groupChats]) => {
      const latestGroupChatMessages = [...groupChats].map((groupChat) => {
        return {
          isGroup: true,
          chatRoomName: groupChat.name,
          latestSentMessageTime: groupChat.latestSentMessageTime,
          groupChat,
        } as MessageTimeSortModel
      })

      const latestUserMessages = [...messages].map((message) => {
        return {
          isGroup: false,
          chatRoomName: message.isUserSender
            ? message.recipientDisplayName
            : message.senderDisplayName,
          latestSentMessageTime: message.messageSentTime,
          message,
        } as MessageTimeSortModel
      })

      let combined: MessageTimeSortModel[] = []
      combined = combined.concat(latestGroupChatMessages ? latestGroupChatMessages : [])
      combined = combined.concat(latestUserMessages ? latestUserMessages : [])

      /*      const combined = latestGroupChatMessages.concat(
                latestUserMessages ? latestUserMessages : [],
              )*/

      return combined.sort(
        (a: MessageTimeSortModel, b: MessageTimeSortModel) =>
          new Date(b.latestSentMessageTime).getTime() - new Date(a.latestSentMessageTime).getTime(),
      )
    }),
  )

  toggleCreatingGroupChat(val: boolean) {
    if (val) this._chatRoomToMessage$.next(undefined)
    this._creatingGroupChat$.next(val)
  }

  setChatRoomToMessage(chatRoom: MessageTimeSortModel) {
    if (chatRoom.isGroup) {
      if (!chatRoom.groupChat) return Error('groupChat should not be null')
      this.groupChatsStore.dispatch.initGroupChat(chatRoom.groupChat.id)
      return this._chatRoomToMessage$.next(chatRoom)
    }
    this.messagesStore.dispatch.initMessagesWithUser(chatRoom.chatRoomName)
    return this._chatRoomToMessage$.next(chatRoom)
  }
}
