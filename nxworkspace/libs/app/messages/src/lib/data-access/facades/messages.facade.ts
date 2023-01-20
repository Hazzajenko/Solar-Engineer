import { inject, Injectable } from '@angular/core'
import { AuthStoreService } from '@auth/data-access/facades'
import { AuthSelectors } from '@auth/data-access/store'
import { Store } from '@ngrx/store'
import { MessageModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { MessagesSelectors } from '../store'

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
    return this.store.select(MessagesSelectors.selectAllMessages).pipe(
      map(messages =>
        messages.filter(message => message.senderUsername === username || message.recipientUsername === username),
      ),
    )
  }

  firstMessageOfEveryConversation$() {
    return this.store.select(AuthSelectors.selectUser).pipe(
      switchMap((user) => this.store.select(MessagesSelectors.selectAllMessages).pipe(
        map(messages => {
          if (!user) return undefined
          console.log(user)
          const map = new Map()
          for (const message of messages) {
            const username = message.recipientUsername !== user.username ? message.recipientUsername : message.senderUsername
            map.set(username, username)
          }
          if (map.get(user.username)) map.delete(user.username)

          const uniqueUsernames = Array.from(map.values())

          return uniqueUsernames.map(
            username => {
              const messagesForUser = messages.filter(msg => msg.senderUsername === username || msg.recipientUsername == username)
              const sortByMessageSent = messagesForUser.sort((a: MessageModel, b: MessageModel) => {
                return new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime()
              })
              return sortByMessageSent[0]
            },
          )
        }),
      )))
  }
}
