import { inject, Injectable } from '@angular/core'
import { AuthSelectors } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import { MessageModel, MessageWebUserModel } from '@shared/data-access/models'
import { combineLatest, combineLatestWith, firstValueFrom, Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MessagesSelectors } from '../store'
import { ConnectionsStoreService } from '@shared/data-access/connections'
import { UsersStoreService } from '@app/data-access/users'

@Injectable({
  providedIn: 'root',
})
export class MessagesFacade {
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
            message.senderUserName !== user?.userName
              ? message.senderUserName
              : message.recipientUserName,
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
            (message.senderUserName === userName && message.recipientUserName === user?.userName) ||
            (message.recipientUserName === userName && message.senderUserName === user?.userName),
        ),
      ),
      switchMap((messages) =>
        combineLatest(
          messages.map((message) =>
            combineLatest([
              of(message),
              this.usersStore.select.webUserCombinedByUserName$(message.senderUserName),
            ]).pipe(map(([message, sender]) => ({ ...message, sender } as MessageWebUserModel))),
          ),
        ),
      ),
    )
  }

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