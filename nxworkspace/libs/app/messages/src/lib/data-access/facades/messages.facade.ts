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
  EMPTY,
  firstValueFrom,
  groupBy,
  mergeAll,
  of,
  take,
  tap,
} from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MessagesSelectors } from '../store'

// import { fn } from '@angular/compiler'

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
                      filtered.*/

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
          groupBy((message) =>
            message.map((message) =>
              message.senderUsername !== user?.username
                ? message.senderUsername
                : message.recipientUsername,
            ),
          ),
          take(1),
        ),
      ),
      mergeAll(),
    )
    /*    return this.messages$.pipe(
          groupBy(message => message.map(message => message.))
        )*/
  }

  groupItemByVal<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
      const groupKey = fn(curr)
      const group = prev[groupKey] || []
      group.push(curr)
      return { ...prev, [groupKey]: group }
    }, {})
  }

  uniqBySetWithSpread<T>(array: T[]): T[] {
    return [...new Set(array)]
  }
}
