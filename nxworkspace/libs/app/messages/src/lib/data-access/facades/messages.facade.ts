import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom } from 'rxjs'
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
}
