import { inject, Injectable } from '@angular/core'
import { AuthSelectors } from '@auth/data-access'
import { Store } from '@ngrx/store'
import {
  CombinedMessageUserModel,
  MessageModel,
  MessageWebUserModel,
} from '@shared/data-access/models'
import { combineLatest, combineLatestWith, firstValueFrom, Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MessagesSelectors } from '../../store/user-messages'
import { ConnectionsStoreService } from '@app/data-access/connections'
import { UsersStoreService } from '@app/data-access/users'
import { sortByMessageSentTime } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesFacade {
  private store = inject(Store)
  private connectionsStore = inject(ConnectionsStoreService)
  private usersStore = inject(UsersStoreService)

  messages$ = this.store.select(MessagesSelectors.selectAllMessages)
  error$ = this.store.select(MessagesSelectors.selectMessagesError)
  loaded$ = this.store.select(MessagesSelectors.selectMessagesLoaded)

  latestUserMessages$ = this.store.select(AuthSelectors.selectUser).pipe(
    switchMap((user) =>
      this.messages$.pipe(
        map((messages) => {
          const orderedMessages = messages.sort(
            (a: MessageModel, b: MessageModel) =>
              new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
          )
          const groupedArr = this.groupItemByVal<MessageModel>(orderedMessages, (message) =>
            message.senderDisplayName !== user?.displayName
              ? message.senderDisplayName
              : message.recipientDisplayName,
          )
          const map = new Map<string, MessageModel>()
          for (const key in groupedArr) {
            map.set(key, groupedArr[key][0])
          }
          // return map
          return [...map.values()]
        }),
      ),
    ),
  )

  get messages() {
    return firstValueFrom(this.messages$)
  }

  messagesWithUser$(userName: string): Observable<MessageWebUserModel[]> {
    return this.store.select(MessagesSelectors.selectAllMessages).pipe(
      combineLatestWith(this.store.select(AuthSelectors.selectUser)),
      map(([messages, user]) =>
        messages.filter(
          (message) =>
            (message.senderDisplayName === userName &&
              message.recipientDisplayName === user?.displayName) ||
            (message.recipientDisplayName === userName &&
              message.senderDisplayName === user?.displayName),
        ),
      ),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) =>
            combineLatest([
              of(message),
              this.usersStore.select.webUserCombinedByUserName$(message.senderDisplayName),
            ]).pipe(map(([message, sender]) => ({ ...message, sender } as MessageWebUserModel))),
          ),
        ),
      ),
      map((messages) => sortByMessageSentTime<MessageWebUserModel>(messages)),
    )
  }

  messagesWithUser2$(userName: string): Observable<CombinedMessageUserModel[]> {
    return this.store.select(MessagesSelectors.selectAllMessages).pipe(
      combineLatestWith(this.store.select(AuthSelectors.selectUser)),
      map(([messages, user]) =>
        messages.filter(
          (message) =>
            (message.senderDisplayName === userName &&
              message.recipientDisplayName === user?.displayName) ||
            (message.recipientDisplayName === userName &&
              message.senderDisplayName === user?.displayName),
        ),
      ),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) =>
            combineLatest([
              of(message),
              this.usersStore.select.webUserCombinedByUserName$(message.senderDisplayName),
            ]).pipe(
              map(
                ([message, sender]) =>
                  ({
                    ...message,
                    sender,
                    isGroup: false,
                    groupChatId: 0,
                    senderInGroup: true,
                    messageReadTimes: [],
                  } as CombinedMessageUserModel),
              ),
            ),
          ),
        ),
      ),
    )
  }

  // CombinedMessageUserModel
  groupItemByVal<T>(arr: T[], fn: (item: T) => any): Record<string, T[]> {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
      const groupKey = fn(curr)
      const group = prev[groupKey] || []
      group.push(curr)
      return { ...prev, [groupKey]: group }
    }, {})
  }

  groupItemByValLast<T>(arr: T[], fn: (item: T) => any): Record<string, T[]> {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
      const groupKey = fn(curr)
      const group = prev[groupKey] || []
      group.push(curr)
      return { ...prev, [groupKey]: group[0] }
    }, {})
  }

  // const yes == typeofG

  groupByMap<T>(list: T[], keyGetter: (item: T) => any) {
    const map = new Map()
    list.forEach((item) => {
      const key = keyGetter(item)
      const collection = map.get(key)
      if (!collection) {
        map.set(key, [item])
      } else {
        collection.push(item)
      }
    })
    return map
  }

  uniqBySetWithSpread<T>(array: T[]): T[] {
    return [...new Set(array)]
  }
}
