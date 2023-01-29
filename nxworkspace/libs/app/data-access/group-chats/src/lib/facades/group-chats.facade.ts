import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  firstValueFrom,
  forkJoin,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
  throwIfEmpty,
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
  WebUserModel,
} from '@shared/data-access/models'
import { orderBy, sortBy } from 'lodash'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { UsersStoreService } from '@app/data-access/users'
import { instanceOf } from 'ts-pattern/dist/patterns'

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
        const groupMembers = this.groupChatMemberWebUsers$(groupChatId).pipe(startWith([]))
        const groupMessages = this.groupChatMessagesWithMembersById$(groupChatId).pipe(
          startWith([]),
        )
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

  /*  groupChatWebUserMembersById$(
      groupChatId: number,
    ) {
      return this.members$.pipe(
        map((members) => members.filter((member) => member.groupChatId === groupChatId)),
        switchMap((members) =>
          combineLatest(
            messages.map((message) => {
              const sender$ = this.groupChatSenderWebUser$(groupChatId, message)
              return combineLatest([of(message), sender$]).pipe(
                map(([message, sender]) => ({ ...message, sender } as GroupChatMessageMemberModel)),
              )
            }),
          ),
        ),
        map((messages) =>
          messages.sort((a: GroupChatMessageMemberModel, b: GroupChatMessageMemberModel) => {
            return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
          }),
        ),
      )
    }*/

  groupChatMessagesWithMembersById$(
    groupChatId: number,
  ): Observable<GroupChatMessageMemberModel[]> {
    return this.messages$.pipe(
      map((messages) => messages.filter((message) => message.groupChatId === groupChatId)),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) => {
            const sender$ = this.groupChatSenderWebUser$(groupChatId, message)
            return combineLatest([of(message), sender$]).pipe(
              map(([message, sender]) => ({ ...message, sender } as GroupChatMessageMemberModel)),
            )
          }),
        ),
      ),
      map((messages) =>
        messages.sort((a: GroupChatMessageMemberModel, b: GroupChatMessageMemberModel) => {
          return new Date(a.messageSentTime).getTime() - new Date(b.messageSentTime).getTime()
        }),
      ),
    )
  }

  groupChatMemberWebUsers$(groupChatId: number): Observable<GroupChatMemberModel[]> {
    return this.groupChatMembersById$(groupChatId).pipe(
      switchMap((members) =>
        combineLatest(
          members.map((member) => {
            return combineLatest([
              of(member),
              this.usersStore.select.webUserCombinedByUserName$(member.userName),
            ]).pipe(map(([member, webUser]) => ({ ...member, ...webUser } as GroupChatMemberModel)))
          }),
        ),
      ),
    )
  }

  groupChatSenderWebUser$(
    groupChatId: number,
    message: GroupChatMessageModel,
  ): Observable<GroupChatMemberModel | undefined> {
    return this.groupChatMembersById$(groupChatId).pipe(
      map((members) => members.find((member) => member.userName === message.senderUserName)),
      switchMap((member) => {
        if (!member) return of(undefined)
        return combineLatest([
          of(member),
          this.usersStore.select.webUserCombinedByUserName$(member.userName),
        ]).pipe(map(([member, webUser]) => ({ ...member, ...webUser } as GroupChatMemberModel)))
      }),
    )
  }

  groupChatMembersById$(groupChatId: number) {
    return this.members$.pipe(
      map((members) => members.filter((member) => member.groupChatId === groupChatId)),
    )
  }
}
