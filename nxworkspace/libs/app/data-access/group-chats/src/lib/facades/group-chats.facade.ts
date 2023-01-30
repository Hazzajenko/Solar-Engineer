import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  catchError,
  combineLatest,
  EMPTY,
  firstValueFrom,
  Observable,
  of,
  startWith,
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
  GROUP_CHAT_SERVER_MEMBER_MODEL,
  GROUP_CHAT_SERVER_MESSAGE_MODEL,
  GroupChatCombinedModel,
  GroupChatMemberModel,
  GroupChatMessageMemberModel,
  GroupChatMessageModel,
  GroupChatServerMessageModel,
  MessageFrom,
} from '@shared/data-access/models'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { UsersStoreService } from '@app/data-access/users'
import { sortByMessageSentTime } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)
  private usersStore = inject(UsersStoreService)

  groupChats$ = this.store.select(GroupChatsSelectors.selectAllGroupChats)
  error$ = this.store.select(GroupChatsSelectors.selectGroupChatsError)
  loaded$ = this.store.select(GroupChatsSelectors.selectGroupChatsLoaded)

  members$ = this.store.select(GroupChatMembersSelectors.selectAllGroupChatMembers)
  membersError$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersError)
  membersLoaded$ = this.store.select(GroupChatMembersSelectors.selectGroupChatMembersLoaded)

  messages$ = this.store.select(GroupChatMessagesSelectors.selectAllGroupChatMessages)
  messagesError$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesError)
  messagesLoaded$ = this.store.select(GroupChatMessagesSelectors.selectGroupChatMessagesLoaded)

  serverMessages$ = this.store.select(GroupChatsSelectors.selectAllGroupServerChatMessages)

  get groupChats() {
    return firstValueFrom(this.groupChats$)
  }

  get members() {
    return firstValueFrom(this.members$)
  }

  get messages() {
    return firstValueFrom(this.messages$)
  }

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
                messages
                  .filter((message) => message.groupChatId === groupChat.id)
                  .sort(
                    (a: GroupChatMessageModel, b: GroupChatMessageModel) =>
                      new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime(),
                  ),
              ),
              take(1),
            )
            const latestSentMessage = groupMessages.pipe(
              map((messages) => (messages[0] ? messages[0] : undefined)),
              take(1),
            )
            const latestSentMessageTime = latestSentMessage.pipe(
              map((message) => (message ? message.messageSentTime : undefined)),
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
        ),
      ),
      catchError((err) => {
        console.error(err)
        return EMPTY
      }),
    )
  }

  groupChatById$(groupChatId: number) {
    return this.groupChats$.pipe(
      map((groupChats) => groupChats.find((chat) => chat.id === groupChatId)),
      tap((groupChat) => console.log(groupChat)),
      switchMap((groupChat) => {
        if (!groupChat) return of(undefined)
        /*        const groupMembers = this.members$.pipe(
                  map((members) => members.filter((member) => member.groupChatId === groupChat.id)),
                )*/
        const groupMembers = this.groupChatMemberWebUsers$(groupChatId).pipe(
          startWith([] as GroupChatMemberModel[]),
        )
        const groupMessages = this.groupChatMessagesWithMembersCombinedWithServerMessagesById2$(
          groupChatId,
        ).pipe(startWith([] as GroupChatMessageMemberModel[]))
        const latestSentMessage = groupMessages.pipe(
          map((messages) => (messages[0] ? messages[0] : undefined)),
          take(1),
        )
        const latestSentMessageTime = latestSentMessage.pipe(
          map((message) => (message ? message.messageSentTime : undefined)),
        )

        return combineLatest([
          of(groupChat),
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

  groupChatMessagesById$(groupChatId: number): Observable<GroupChatMessageModel[]> {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
    )
  }

  groupChatMessagesWithMembersById$(
    groupChatId: number,
  ): Observable<GroupChatMessageMemberModel[]> {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) => {
            const sender$ = this.groupChatSenderWebUser$(message)
            return combineLatest([of(message), sender$]).pipe(
              map(([message, sender]) => ({ ...message, sender } as GroupChatMessageMemberModel)),
            )
          }),
        ),
      ),
      map(
        (messages) => sortByMessageSentTime<GroupChatMessageMemberModel>(messages),
        /*        messages.sort((a: GroupChatMessageMemberModel, b: GroupChatMessageMemberModel) => {
                  return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
                }),*/
      ),
    )
  }

  getMessagesAndServerMessagesCombined$(groupChatId: number) {
    return combineLatest([
      this.messages$.pipe(
        map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
      ),
      this.serverMessages$.pipe(
        map((messages) =>
          messages
            .filter((message) => message.groupChatId === groupChatId)
            .map((msg) => {
              return {
                ...msg,
                id: 0,
              } as GroupChatMessageModel
            }),
        ),
      ),
    ]).pipe(map(([messages, serverMessages]) => [...messages, ...serverMessages]))
  }

  groupChatMessagesWithMembersCombinedWithServerMessagesById2$(groupChatId: number) {
    return this.getMessagesAndServerMessagesCombined$(groupChatId).pipe(
      switchMap((messages) => combineLatest(this.combineMessagesWithWebUsers$(messages))),
      map((messages) => sortByMessageSentTime<GroupChatMessageMemberModel>(messages)),
    )
  }

  combineMessagesWithWebUsers$(messages: GroupChatMessageModel[]) {
    return messages.map((message) => {
      if (message.messageFrom === MessageFrom.Server) {
        const sender$ = of(GROUP_CHAT_SERVER_MEMBER_MODEL())
        return combineLatest([of(message), sender$]).pipe(
          map(([message, sender]) => ({ ...message, sender } as GroupChatMessageMemberModel)),
        )
      }
      const sender$ = this.groupChatSenderWebUser$(message)
      return combineLatest([of(message), sender$]).pipe(
        map(([message, sender]) => ({ ...message, sender } as GroupChatMessageMemberModel)),
      )
    })
  }

  groupChatMemberWebUsers$(groupChatId: number): Observable<GroupChatMemberModel[]> {
    return this.groupChatMembersById$(groupChatId).pipe(
      switchMap((members) =>
        combineLatest(
          members.map((member) => {
            return combineLatest([
              of(member),
              this.usersStore.select.webUserCombinedByUserName$(member.userName),
            ]).pipe(
              map(
                ([member, webUser]) =>
                  ({
                    ...member,
                    ...webUser,
                    isServer: false,
                  } as GroupChatMemberModel),
              ),
            )
          }),
        ),
      ),
    )
  }

  groupChatSenderWebUser$(
    message: GroupChatMessageModel,
  ): Observable<GroupChatMemberModel | undefined> {
    return this.groupChatMembersById$(message.groupChatId).pipe(
      map((members) => members.find((member) => member.userName === message.senderUserName)),
      switchMap((member) => {
        if (!member) return of(undefined)
        return combineLatest([
          of(member),
          this.usersStore.select.webUserCombinedByUserName$(member.userName),
        ]).pipe(
          map(
            ([member, webUser]) =>
              ({
                ...member,
                ...webUser,
                isServer: false,
              } as GroupChatMemberModel),
          ),
        )
      }),
    )
  }

  /*  isOnline: boolean
    isFriend: boolean
    becameFriendsTime: string | null*/

  groupChatMembersById$(groupChatId: number) {
    return this.members$.pipe(
      map((members) => members.filter((member) => member.groupChatId === groupChatId)),
    )
  }
}
