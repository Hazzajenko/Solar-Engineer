import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MessagesSignalrService } from '@app/data-access/signalr'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { MessageModel, NotificationStatus } from '@shared/data-access/models'

import { map, switchMap, tap } from 'rxjs/operators'
import { GroupChatsService } from '../../../../../data-access/group-chats/src/lib'
import { MessagesService } from '../api'
import { MessagesActions, MessagesSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class MessagesEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private messagesService = inject(MessagesService)
  private groupChatsService = inject(GroupChatsService)
  private messagesSignalR = inject(MessagesSignalrService)
  private snackBar = inject(MatSnackBar)
  initMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap(({ token }) => this.messagesSignalR.createMessagesConnection(token)),
      tap(() => this.messagesService.waitForGetMessages()),
      tap(() => this.groupChatsService.waitForGroupChatsMessages()),
      switchMap(() =>
        this.messagesService
          .getLatestUserMessages()
          .pipe(map((messages) => MessagesActions.addManyMessages({ messages }))),
      ),
    ),
  )

  /*  initMessagesWithUser$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(GroupChatMessagesActions.initMessagesWithUser),
          switchMap(({ userName }) => this.messagesService.getAllMessagesWithUser(userName).pipe(
            // switchMap(({ userName }) => this.messagesService.getAllMessagesWithUser(userName).pipe(
            map(({ messages }) => GroupChatMessagesActions.addManyMessages({ messages })),
          )),
        ),
    )*/

  initMessagesConnectionWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.initMessagesWithUser),
        map(({ userName }) => this.messagesService.getMessagesWithUserSignalR(userName)),
      ),
    { dispatch: false },
  )

  /* sendMessageToUser$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(GroupChatMessagesActions.sendMessageToUser),
         switchMap(({ request }) =>
           this.messagesService.sendMessageToUser(request).pipe(
             map(({ message }) => GroupChatMessagesActions.addMessage({ message })),
           ),
         ),
       ),
   )*/

  sendMessageToUserSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.sendMessageToUser),
        map(({ request }) => this.messagesService.sendMessageToUserSignalR(request)),
      ),
    { dispatch: false },
  )

  addMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.addReceivedMessage),
        map(({ message }) => {
          const messageFrom = message.senderUserName
          this.snackBar.open(`New message from ${messageFrom}!`, 'OK', {
            duration: 5000,
          })
        }),
      ),
    { dispatch: false },
  )

  updateMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.updateMessage),
        switchMap(({ update }) => this.messagesService.updateMessage(update)),
      ),
    { dispatch: false },
  )

  updateManyMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.updateManyMessages),
        switchMap(({ updates }) => this.messagesService.updateManyMessages(updates)),
      ),
    { dispatch: false },
  )

  markAllMessagesAsReadWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.markAllMessagesAsReadWithUser),
        switchMap(({ recipient }) =>
          this.store
            .select(MessagesSelectors.selectAllMessages)
            .pipe(
              map((messages) =>
                messages.filter(
                  (message) =>
                    message.senderUserName === recipient &&
                    message.status === NotificationStatus.Unread,
                ),
              ),
            )
            .pipe(
              map((userMessages) => {
                const updates: Update<MessageModel>[] = userMessages.map((message) => {
                  const update: Update<MessageModel> = {
                    id: message.id,
                    changes: {
                      status: NotificationStatus.Read,
                    },
                  }
                  return update
                })
                return MessagesActions.updateManyMessages({ updates })
              }),
            ),
        ),
      ),
    // { dispatch: false },
  )
}
