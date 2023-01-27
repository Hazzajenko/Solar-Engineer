import { inject, Injectable } from '@angular/core'
import { MessagesStoreService } from '@app/messages'
import { GroupChatsStoreService } from '@app/data-access/group-chats'
import { combineLatest, combineLatestWith, map, mergeAll, Observable, switchMap, take } from 'rxjs'
import { GroupChatMessageModel, MessageTimeSortModel } from '@shared/data-access/models'
import { AuthStoreService } from '@auth/data-access/facades'
import { ChatroomSearchModel } from './chatroom-search.model'

@Injectable({
  providedIn: 'root',
})
export class ChatroomsService {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)

  initialUserMessages$ = this.authStore.select.user$.pipe(
    map((user) => user?.userName),
    switchMap((userName) =>
      this.messagesStore.select.messages$.pipe(
        map((messages) =>
          messages?.map((message) => {
            if (message.senderUserName !== userName) {
              return message.senderUserName
            }
            return message.recipientUserName
          }),
        ),
      ),
    ),
  )

  get combinedUserMessagesAndGroupChats$() {
    return combineLatest([
      this.messagesStore.select.messagesData2$,
      this.groupChatsStore.select.groupChatsWithLatestMessage$,
    ]).pipe(
      map(([messages, groupChats]) => {
        const latestGroupChatMessages = [...groupChats].map((groupChat) => {
          return {
            isGroup: true,
            latestSentMessageTime: groupChat.latestSentMessageTime,
            groupChat,
          } as MessageTimeSortModel
        })

        const latestUserMessages = [...messages].map((message) => {
          return {
            isGroup: false,
            latestSentMessageTime: message.messageSentTime,
            message,
          } as MessageTimeSortModel
        })

        const combined = latestGroupChatMessages.concat(
          latestUserMessages ? latestUserMessages : [],
        )

        return combined.sort(
          (a: MessageTimeSortModel, b: MessageTimeSortModel) =>
            new Date(b.latestSentMessageTime).getTime() -
            new Date(a.latestSentMessageTime).getTime(),
        )
      }),
    )
  }

  get chatRoomSearchData$2(): Observable<ChatroomSearchModel[]> {
    return this.combinedUserMessagesAndGroupChats$.pipe(
      combineLatestWith(this.authStore.select.user$),
      map(([chatRooms, user]) =>
        chatRooms.map((chatroom) => {
          if (chatroom.isGroup) {
            return {
              isGroup: true,
              chatRoomName: chatroom.groupChat?.name,
              lastMessageTime: chatroom.groupChat?.latestSentMessageTime,
            } as ChatroomSearchModel
          }
          if (chatroom.message?.senderUserName !== user?.userName) {
            return {
              isGroup: false,
              chatRoomName: chatroom.message?.senderUserName,
              lastMessageTime: chatroom.message?.messageSentTime,
            } as ChatroomSearchModel
          }
          return {
            isGroup: false,
            chatRoomName: chatroom.message?.recipientUserName,
            lastMessageTime: chatroom.message?.messageSentTime,
          } as ChatroomSearchModel
        }),
      ),
    )
  }

  get chatRoomSearchData$(): Observable<ChatroomSearchModel[]> {
    return this.authStore.select.user$.pipe(
      switchMap((user) => {
        const userMessages = this.messagesStore.select.messagesData$.pipe(
          map((messages) =>
            messages?.map((message) => {
              if (message.senderUserName !== user?.userName) {
                return {
                  isGroup: false,
                  chatRoomName: message.senderUserName,
                  lastMessageTime: message.messageSentTime,
                } as ChatroomSearchModel
              }
              return {
                isGroup: false,
                chatRoomName: message.recipientUserName,
                lastMessageTime: message.messageSentTime,
              } as ChatroomSearchModel
            }),
          ),
        )

        const groupChatMessages = this.groupChatsStore.select.groupChats$.pipe(
          switchMap((groupChats) =>
            combineLatest(
              groupChats.map((groupChat) =>
                this.groupChatsStore.select.messages$.pipe(
                  map((messages) =>
                    messages
                      .filter((message) => message.groupChatId === groupChat.id)
                      .sort(
                        (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                          new Date(b.messageSentTime).getTime() -
                          new Date(a.messageSentTime).getTime(),
                      )
                      .map(
                        () =>
                          ({
                            isGroup: true,
                            chatRoomName: groupChat.name,
                            lastMessageTime: messages[0].messageSentTime,
                          } as ChatroomSearchModel),
                      ),
                  ),
                  take(1),
                ),
              ),
            ),
          ),
          mergeAll(),
        )
        return userMessages.pipe(
          combineLatestWith(groupChatMessages),
          map(([userMessages, groupChatMessages]) => userMessages.concat(groupChatMessages)),
        )
      }),
    )
  }
}
