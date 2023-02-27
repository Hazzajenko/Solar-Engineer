import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { AuthActions } from '@auth/data-access/store'
import { tap } from 'rxjs/operators'
import { MessagesSignalrService } from '../api'
// import { UserMessagesSignalrService } from '@app/data-access/messages'
import { GroupChatsSignalrService } from '../api/group-chats'
import { UserMessagesSignalrService } from '@app/data-access/messages'

// import { UserMessagesSignalrService } from '@app/data-access/messages'

@Injectable({
  providedIn: 'root',
})
export class MessagesEffects {
  private actions$ = inject(Actions)
  private messagesSignalrService = inject(MessagesSignalrService)
  private userMessagesSignalrService = inject(UserMessagesSignalrService)
  private groupChatsSignalrService = inject(GroupChatsSignalrService)

  initMessagesConnection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap(({ token }) => {
        const hubConnection = this.messagesSignalrService.createMessagesHubConnection(token)
        this.userMessagesSignalrService.initUserMessagesHandlers(hubConnection)
        this.groupChatsSignalrService.initGroupChatsHandlers(hubConnection)
      }),
      // tap(() => this.messagesService.waitForGetMessages()),
      // tap(() => this.groupChatsSignalR.init()),
      // tap(() => this.groupChatsSignalR.onGetGroupChatServerMessages()),
      /*      switchMap(() =>
              this.messagesService
                .getLatestUserMessages()
                .pipe(map((messages) => UserMessagesActions.addManyMessages({ messages }))),
            ),*/
    ),
  )
}
