import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  firstValueFrom,
  forkJoin,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs'
import {
  GroupChatMembersSelectors,
  GroupChatMessagesSelectors,
  GroupChatsSelectors,
} from '../store'
import { map } from 'rxjs/operators'
import {
  GroupChatCombinedModel,
  GroupChatMemberModel,
  GroupChatMessageMemberModel,
  GroupChatMessageModel,
  MessageModel,
} from '@shared/data-access/models'
import { orderBy, sortBy } from 'lodash'
import { ConnectionsStoreService } from '@shared/data-access/connections'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)

  groupChats$ = this.store.select(GroupChatsSelectors.selectAllGroupChats)
  error$ = this.store.select(GroupChatsSelectors.selectGroupChatsError)
  loaded$ = this.store.select(GroupChatsSelectors.selectGroupChatsLoaded)

  members$ = this.store.select(GroupChatMembersSelectors.selectAllGroupChatMembers)
  membersError$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersError)
  membersLoaded$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersLoaded)

  messages$ = this.store.select(GroupChatMessagesSelectors.selectAllGroupChatMessages)
  messagesError$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesError)
  messagesLoaded$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesLoaded)

  get groupChats() {
    return firstValueFrom(this.groupChats$)
  }

  get members() {
    return firstValueFrom(this.members$)
  }

  get messages() {
    return firstValueFrom(this.messages$)
  }

  /*  sort((a: MessageModel, b: MessageModel) => {
    return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
  })*/
  get groupChatsWithLatestMessage$() {
    return this.groupChats$.pipe(
      switchMap((groupChats) =>
        combineLatest(
          groupChats.map((group) => {
            const groupChat = group
            const groupMembers = this.members$.pipe(
              map((members) => members.filter((member) => member.groupChatId === groupChat.id)),
            )
            const groupMessages = this.messages$.pipe(
              map((messages) =>
                messages.sort(
                  (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                    new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
                ),
              ),
              take(1),
            )
            const latestSentMessage = groupMessages.pipe(
              map((messages) => messages[0]),
              /*                  messages.sort(
                                  (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                                    new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
                                ),*/

              // sort
              take(1),
            )
            /*            const latestSentMessage = groupMessages.pipe(
                          // map((messages) => messages.filter((message) => message.groupChatId === groupChat.id)),
                          map(
                            (messages) => messages[0],
                            /!*                messages.sort(
                                              (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                                                new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
                                            ),*!/
                          ),
                          // take(1),
                        )*/
            // const latestSentMessage = groupMessages.pipe(map((messages) => messages))
            const latestSentMessageTime = latestSentMessage.pipe(
              map((message) => message.messageSentTime),
            )
            /*          const latestSentMessage = groupMessages.pipe(
                      map(messages => messages[0].content)
                    )*/
            return combineLatest([
              of(group),
              groupMembers,
              groupMessages,
              latestSentMessage,
              latestSentMessageTime,
            ]).pipe(
              map(
                ([
                  groupChat,
                  groupMembers,
                  groupMessages,
                  latestSentMessage,
                  latestSentMessageTime,
                ]) => {
                  return {
                    ...groupChat,
                    latestSentMessage,
                    latestSentMessageTime,
                    members: groupMembers,
                    messages: groupMessages,
                  } as GroupChatCombinedModel
                },
              ),
            )
            /*          return combineLatest([
                      of(group),
                      groupMembers,
                      groupMessages
                    ])*/
          }),
        ),
      ),
      catchError((err) => {
        console.error(err)
        return EMPTY
      }),
      tap((res) => console.log(res)),
    )
  }

  groupChatMessagesById$(groupChatId: number) {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
      /*      map((messages) =>
              messages.sort(
                (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                  new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime(),
              ),
            ),*/
    )
  }

  groupChatMessagesWithMembersById$(groupChatId: number) {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) => {
            const sender = this.groupChatMembersById$(groupChatId).pipe(
              map((members) =>
                members.find((member) => member.userName === message.senderUserName),
              ),
            )
            return combineLatest([of(message), sender]).pipe(
              map(([message, sender]) => ({ message, sender })),
            )
          }),
        ),
      ),
      map((combinedArr) =>
        combinedArr.map(
          (combined) =>
            ({
              ...combined.message,
              sender: combined.sender,
            } as GroupChatMessageMemberModel),
        ),
      ),
    )
  }

  groupChatMembersById$(groupChatId: number) {
    return this.connectionsStore.select.connections$.pipe(
      switchMap((connections) =>
        this.members$.pipe(
          map((members) =>
            members
              .filter((member) => member.groupChatId === groupChatId)
              .map(
                (member) =>
                  ({
                    ...member,
                    isOnline: !!connections.find(
                      (connection) => connection.userName === member.userName,
                    ),
                  } as GroupChatMemberModel),
              ),
          ),
          // tap((res) => console.log(res)),
        ),
      ),
    )
  }

  groupChatById$(groupChatId: number) {
    return this.groupChats$.pipe(
      map((groupChats) => groupChats.find((chat) => chat.id === groupChatId)),
      switchMap((group) => {
        if (!group) return of(undefined)
        const groupChat = group
        const groupMembers = this.members$.pipe(
          map((members) => members.filter((member) => member.groupChatId === groupChat.id)),
        )
        const groupMessages = this.messages$.pipe(
          map((messages) => messages.filter((message) => message.groupChatId === groupChat.id)),
          map((messages) =>
            messages.sort(
              (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
            ),
          ),
          take(1),
        )
        const latestSentMessage = groupMessages.pipe(map((messages) => messages[0]))
        const latestSentMessageTime = latestSentMessage.pipe(
          map((message) => message.messageSentTime),
        )

        return combineLatest([
          of(group),
          groupMembers,
          groupMessages,
          latestSentMessage,
          latestSentMessageTime,
        ]).pipe(
          map(
            ([
              groupChat,
              groupMembers,
              groupMessages,
              latestSentMessage,
              latestSentMessageTime,
            ]) => {
              return {
                ...groupChat,
                latestSentMessage,
                latestSentMessageTime,
                members: groupMembers,
                messages: groupMessages,
              } as GroupChatCombinedModel
            },
          ),
        )
      }),
    )
  }

  get groupChatsCombined$() {
    return this.groupChats$.pipe(
      switchMap((groupChats) =>
        groupChats.map((group) => {
          const groupChat = group
          const groupMembers = this.members$.pipe(
            map((members) => members.filter((member) => member.groupChatId === groupChat.id)),
          )
          const groupMessages = this.messages$.pipe(
            map((messages) => messages.filter((message) => message.groupChatId === groupChat.id)),
          )
          return [groupChat, groupMembers, groupMessages]
          /*    return {
                groupChat,
                groupMembers,
                groupMessages
              }*/
        }),
      ),
      /*    switchMap(() => {
            return {
              groupChat: of(groupChat),
              groupMembers,
              groupMessages
            }
          })*/
    )
  }
}
