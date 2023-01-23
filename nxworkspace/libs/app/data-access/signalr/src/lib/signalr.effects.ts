import { inject, Injectable } from '@angular/core'
import { GroupChatsService } from '@app/data-access/group-chats'
import { MessagesActions, MessagesService, MessagesSignalrService } from '@app/data-access/messages'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'

import { map, switchMap, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SignalrEffects {
  private actions$ = inject(Actions)
  private messagesService = inject(MessagesService)
  private groupChatsService = inject(GroupChatsService)
  private messagesSignalR = inject(MessagesSignalrService)
  initSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        tap(({ token }) => this.messagesSignalR.createMessagesConnection(token)),
        tap(() => this.messagesService.waitForGetMessages()),
        tap(() => this.groupChatsService.waitForGroupChatsMessages()),
        switchMap(() =>
          this.messagesService.getAllMessages().pipe(
            map(({ messages }) => MessagesActions.addManyMessages({ messages })),
          ),
        ),
      ),
  )

}
