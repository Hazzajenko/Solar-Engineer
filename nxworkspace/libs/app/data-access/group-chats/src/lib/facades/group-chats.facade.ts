import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  catchError,
  combineLatest,
  EMPTY,
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
  GroupChatMessageModel,
  MessageModel,
} from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsFacade {
  private store = inject(Store)

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
