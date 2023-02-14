import { inject, Injectable } from '@angular/core'
import { AuthStoreService } from '@auth/data-access/facades'
import { AuthSelectors } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import {
  GroupChatCombinedModel,
  GroupChatMessageModel,
  MessageModel,
  MessageTimeSortModel,
} from '@shared/data-access/models'
import {
  catchError,
  combineLatest,
  combineLatestWith,
  concatMap,
  EMPTY,
  find,
  firstValueFrom,
  from,
  groupBy,
  last,
  mergeAll,
  mergeMap,
  Observable,
  of,
  switchAll,
  take,
  takeLast,
  tap,
  toArray,
  zip,
} from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MessagesSelectors } from '../store'
import { orderBy } from 'lodash'

// import { fn } from '@angular/compiler'
// export type ArgumentTypes<F extends Functi
// on> = F extends (...args: infer A) => any ? A : never

@Injectable({
  providedIn: 'root',
})
export class MessagesFacade {
  private store = inject(Store)

  messages$ = this.store.select(MessagesSelectors.selectAllMessages)
  error$ = this.store.select(MessagesSelectors.selectMessagesError)
  loaded$ = this.store.select(MessagesSelectors.selectMessagesLoaded)
  /*
    get messages() {
      return firstValueFrom(this.messages$)
    }

    messagesWithUser$(userName: string): Observable<MessageModel[]> {
      return this.store
        .select(MessagesSelectors.selectAllMessages)
        .pipe(
          map((messages) =>
            messages.filter(
              (message) =>
                message.senderUserName === userName || message.recipientUserName === userName,
            ),
          ),
        )
    }

    get latestUserMessages$(): Observable<MessageModel[]> {
      return this.store.select(AuthSelectors.selectUser).pipe(
        switchMap((user) =>
          this.messages$.pipe(
            map((messages) => {
              /!*         const orderedMessages = orderBy(
                         messages,
                         (m) => new Date(m.messageSentTime).getTime(),
                         'desc',
                       )*!/
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
    }*/
}
