import { inject, Injectable } from '@angular/core'
import { AuthStoreService } from '@auth/data-access/facades'
import { AuthSelectors } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import {
  GroupChatCombinedModel,
  GroupChatMessageModel,
  MessageModel,
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

  get messages() {
    return firstValueFrom(this.messages$)
  }

  messagesWithUser$(username: string) {
    return this.store
      .select(MessagesSelectors.selectAllMessages)
      .pipe(
        map((messages) =>
          messages.filter(
            (message) =>
              message.senderUsername === username || message.recipientUsername === username,
          ),
        ),
      )
  }

  firstMessageOfEveryConversation$() {
    return this.store.select(AuthSelectors.selectUser).pipe(
      switchMap(
        (user) =>
          this.messages$.pipe(
            map((messages) => {
              if (!user) return []
              // console.log(user)

              const map = new Map()
              for (const message of messages) {
                const username =
                  message.recipientUsername !== user.username
                    ? message.recipientUsername
                    : message.senderUsername
                map.set(username, username)
              }
              if (map.get(user.username)) map.delete(user.username)

              /*
                      const filtered = this.uniqBySetWithSpread<string>(usernames)
                      console.log(filtered)
                      filtered.
                      */

              const group = messages.reduce(function (r, a) {
                r[a.recipientUsername] = r[a.recipientUsername] || []
                r[a.recipientUsername].push(a)
                return r
              }, Object.create(null))

              console.log(group)
              // const message: MessageModel
              const hii = this.groupItemByVal(messages, (m) =>
                m.senderUsername !== user.username ? m.senderUsername : m.recipientUsername,
              )

              console.log('hii', hii)

              /*   messages.reduce<Record<string, MessageModel[]>>((prev, curr) => {
                   const groupKey = MessageModel(curr)
                   const group = prev[groupKey] || []
                   group.push(curr)
                   return { ...prev, [groupKey]: group }
                 }, {})*/

              return Array.from(map.values())
              // const uniqueUsernames = Array.from(map.values())

              /*        return uniqueUsernames.map((username) => {
                        const messagesForUser = messages.filter(
                          (msg) => msg.senderUsername === username || msg.recipientUsername == username,
                        )
                        const sortByMessageSent = messagesForUser.sort(
                          (a: MessageModel, b: MessageModel) => {
                            return (
                              new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
                            )
                          },
                        )
                        return sortByMessageSent[0]
                      })*/
            }),
            // groupBy(data => data.map(da => da.senderUsername
            // ))
          ),
        // groupBy(data => data.)
      ),
      // groupBy(data => data.)
    )
  }

  get messagesData$() {
    return this.store.select(AuthSelectors.selectUser).pipe(
      switchMap((user) =>
        this.messages$.pipe(
          map((messages) =>
            orderBy(messages, (m) => new Date(m.messageSentTime).getTime(), 'desc'),
          ),
          tap((messages) => console.log(messages)),
          /*map(messages => {
              const orderByDesc =  orderBy(messages, (m) => new Date(m.messageSentTime).getTime(), 'desc')
              const group = lodash.groupBy(messages, (message) =>
                message.senderUsername !== user?.username
                  ? message.senderUsername
                  : message.recipientUsername,
              )
              group.g
              const fdsaf = messages.map(msg => {

              })*/
          /* const group = _.groupBy(messages, (message) =>
                message.senderUsername !== user?.username
                  ? message.senderUsername
                  : message.recipientUsername,
              )*/

          // })
          /*          map((messages) =>
                        _.groupBy(messages, (message) =>
                          message.senderUsername !== user?.username
                            ? message.senderUsername
                            : message.recipientUsername,
                        ),
                      ),
                      map(data => data.)*/
          /*          map((messages) => {
                        const uniqueMessages = messages.map((message) =>
                          message.senderUsername !== user?.username
                            ? message.senderUsername
                            : message.recipientUsername,
                        )
                        return messages
                      }),*/

          groupBy(
            (message) =>
              message.map((message) =>
                message.senderUsername !== user?.username
                  ? message.senderUsername
                  : message.recipientUsername,
              ),
            // .map((messages) => messages[messages.length - 1]),
          ),
          tap((group) => console.log('group', group)),
          /*       switchMap(
                   (group) =>
                     group.pipe(
                       map((g) => g.filter((h) => h.messageSentTime === group.key.map((key) => key))),
                     ),
                   /!*           group.key.map(
                                key => group.pipe(data => data.pipe(p => p.))
                     /!*           map((g) => g[0]),
                                toArray(),*!/
                              ),*!/
                 ),*/
          // take(1),
          switchAll(),

          // switchMap((group) => group.pipe(toArray()))),
          tap((data) => console.log('DATA', data)),
          // map(data => data.map(d => d.map(e => e.))),

          /*          switchMap((group) =>
                      group.pipe(
                        map((group) => orderBy(group, (m) => new Date(m.messageSentTime).getTime(), 'desc')),
                        tap((data) => console.log('DATA', data)),
                        map((data) => data[data.length - 1]),
                        // map((data) => data.pop()),
                        tap((data) => console.log('DATA', data)),

                        // take(1),
                        // take(1),

                        // toArray(),
                        // tap((data) => console.log('DATAArr', data)),
                      ),
                    ),*/
          // map((data) => data.messageSentTime),
          take(6),

          // toArray(),

          tap((data) => console.log('dasdsa', data)),

          // mergeAll(),
          // map((data) => data.map((messages) => messages[messages.length - 1])),

          // takeLast(1),

          /*        map(messages => messages.pipe(
                      map(messages => messages[messages.length - 1])
                    ))*/
          // concatMap(array=>from(array)), // emit array elements
          // last(),

          /*
                 map(messages => messages.pipe(
                   map(messages => messages[0])
                 ))*/
          // find(message => message.)
          // take(1),

          // takeLast(1),
        ),
      ),
      // take(1),
      // toArray(),
      // mergeAll(),

      tap((res) => console.log('FUUUU', res)),
    )
    /*    return this.messages$.pipe(
          groupBy(message => message.map(message => message.))
        )*/
  }

  get messagesData2$() {
    return this.store.select(AuthSelectors.selectUser).pipe(
      switchMap((user) =>
        this.messages$.pipe(
          map((messages) => {
            const orderedMessages = orderBy(
              messages,
              (m) => new Date(m.messageSentTime).getTime(),
              'desc',
            )
            const groupedArr = this.groupItemByVal<MessageModel>(orderedMessages, (message) =>
              message.senderUsername !== user?.username
                ? message.senderUsername
                : message.recipientUsername,
            )
            const map = new Map<string, MessageModel>()
            for (const key in groupedArr) {
              map.set(key, groupedArr[key][0])
            }
            // return map
            return [...map.values()]
          }),
          tap((messages) => console.log('map', messages)),
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
