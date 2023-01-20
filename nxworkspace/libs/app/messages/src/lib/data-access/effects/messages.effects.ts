import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'

import { map, switchMap } from 'rxjs/operators'
import { MessagesService } from '../api'
import { MessagesActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class MessagesEffects {
  private actions$ = inject(Actions)
  private messagesService = inject(MessagesService)
  private snackBar = inject(MatSnackBar)
  initMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        map(({ token }) => this.messagesService.createMessagesConnection(token)),
        switchMap(() =>
          this.messagesService.getAllMessages().pipe(
            map(({ messages }) => MessagesActions.addManyMessages({ messages })),
          ),
        ),
      ),
  )

  initMessagesWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.initMessagesWithUser),
        switchMap(({ username }) => this.messagesService.getAllMessagesWithUser(username).pipe(
          // switchMap(({ username }) => this.messagesService.getAllMessagesWithUser(username).pipe(
          map(({ messages }) => MessagesActions.addManyMessages({ messages })),
        )),
      ),
  )

  initMessagesConnectionWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.initMessagesWithUser),
        map(({ username }) => this.messagesService.getMessagesWithUserSignalR(username)),
      ),
    { dispatch: false },
  )

  sendMessageToUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.sendMessageToUser),
        switchMap(({ request }) =>
          this.messagesService.sendMessageToUser(request).pipe(
            map(({ message }) => MessagesActions.addMessage({ message })),
          ),
        ),
      ),
  )

  addMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.addReceivedMessage),
        map(({ message }) => {
            const messageFrom = message.senderUsername
            this.snackBar.open(`New message from ${messageFrom}!`, 'OK', {
              duration: 5000,
            })
          },
        ),
      ),
    { dispatch: false },
  )

  updateMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.updateMessage),
        switchMap(({ update }) => this.messagesService.updateMessage(update),
        ),
      ),
    { dispatch: false },
  )

  updateManyMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.updateManyMessages),
        switchMap(({ updates }) => this.messagesService.updateManyMessages(updates),
        ),
      ),
    { dispatch: false },
  )
}
