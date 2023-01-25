import { inject, Injectable } from '@angular/core'
import { MessagesStoreService } from '@app/messages'
import { GroupChatsStoreService } from '@app/data-access/group-chats'
import { combineLatest, combineLatestWith, map, mergeAll, Observable, switchMap, take } from 'rxjs'
import { GroupChatMessageModel, MessageTimeSortModel } from '@shared/data-access/models'
import { AuthStoreService } from '@auth/data-access/facades'
import { ChatroomSearchModel } from './chatroom-search.model'
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class ChatroomsService {
  private messagesStore = inject(MessagesStoreService)
  private authStore = inject(AuthStoreService)
  private groupChatsStore = inject(GroupChatsStoreService)

  initialUserMessages$ = this.authStore.select.user$.pipe(
    map((user) => user?.username),
    switchMap((username) =>
      this.messagesStore.select.messages$.pipe(
        map((messages) =>
          messages?.map((message) => {
            if (message.senderUsername !== username) {
              return message.senderUsername
            }
            return message.recipientUsername
          }),
        ),
      ),
    ),
  )

  getCombinedUserMessagesAndGroupChats$() {
    return combineLatest([
      this.messagesStore.select.messagesData$,
      this.groupChatsStore.select.groupChatsWithLatestMessage$,
    ]).pipe(
      map(([messages, groupChats]) => {
        console.log(messages)
        // const latestGroupChatMessages = groupChats.map(groupChat => groupChat.latestSentMessage)
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
        const yo = _.sortBy(combined, (x) => x.latestSentMessageTime)
        const yo2 = _.orderBy(combined, [(x) => x.latestSentMessageTime], ['asc'])
        // _.orderBy(
        //
        // )
        // return _.orderBy(combined, [(x) => x.latestSentMessageTime], ['desc'])
        console.log(yo)
        console.log(yo2)
        // console.log(yo3)

        // _.sor
        // sort(combined).asc([(dog) => dog.breed, (dog) => dog.name])

        return combined.sort(
          (a: MessageTimeSortModel, b: MessageTimeSortModel) =>
            new Date(b.latestSentMessageTime).getTime() -
            new Date(a.latestSentMessageTime).getTime(),
        )
      }),
    )
  }

  get chatRoomSearchData$(): Observable<ChatroomSearchModel[]> {
    return this.authStore.select.user$.pipe(
      switchMap((user) => {
        const userMessages = this.messagesStore.select.messagesData$.pipe(
          map((messages) =>
            messages?.map((message) => {
              if (message.senderUsername !== user?.username) {
                return {
                  isGroup: false,
                  chatRoomName: message.senderUsername,
                  lastMessageTime: message.messageSentTime,
                } as ChatroomSearchModel
              }
              return {
                isGroup: false,
                chatRoomName: message.recipientUsername,
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
                    messages.filter((message) => message.groupChatId === groupChat.id),
                  ),
                  map((messages) =>
                    messages.sort(
                      (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                        new Date(b.messageSentTime).getTime() -
                        new Date(a.messageSentTime).getTime(),
                    ),
                  ),
                  map((messages) =>
                    messages.map(
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
        // return combineLatest([userMessages, groupChatMessages])
      }),
    )
  }
}
