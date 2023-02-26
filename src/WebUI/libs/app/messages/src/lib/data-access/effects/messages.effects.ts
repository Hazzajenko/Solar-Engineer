/*
import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UserMessagesSignalrService } from '@app/data-access/signalr'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { MessageModel, NotificationStatus } from '@shared/data-access/models'

import { map, switchMap, tap } from 'rxjs/operators'
import { GroupChatsService } from '../../../../../data-access/group-chats/src/lib'
import { UserMessagesService } from '../api'
import { UserMessagesActions, MessagesSelectors } from '../store'

@Injectable({
  providedIn: 'root',
})
export class UserMessagesEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private messagesService = inject(UserMessagesService)
  private groupChatsService = inject(GroupChatsService)
  private messagesSignalR = inject(UserMessagesSignalrService)
  private snackBar = inject(MatSnackBar)
  initMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      tap(({ token }) => this.messagesSignalR.createMessagesConnection(token)),
      tap(() => this.messagesService.waitForGetMessages()),
      tap(() => this.groupChatsService.waitForGroupChatMessages()),
      switchMap(() =>
        this.messagesService
          .getLatestUserMessages()
          .pipe(map((user-user-user-messages) => UserMessagesActions.addManyMessages({ user-user-user-messages }))),
      ),
    ),
  )

  /!*  initMessagesWithUser$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(GroupChatMessagesActions.initMessagesWithUser),
          switchMap(({ userName }) => this.messagesService.getAllMessagesWithUser(userName).pipe(
            // switchMap(({ userName }) => this.messagesService.getAllMessagesWithUser(userName).pipe(
            map(({ user-user-user-messages }) => GroupChatMessagesActions.addManyMessages({ user-user-user-messages })),
          )),
        ),
    )*!/

  initMessagesConnectionWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserMessagesActions.initMessagesWithUser),
        map(({ userName }) => this.messagesService.getMessagesWithUserSignalR(userName)),
      ),
    { dispatch: false },
  )

  /!* sendMessageToUser$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(GroupChatMessagesActions.sendMessageToUser),
         switchMap(({ request }) =>
           this.messagesService.sendMessageToUser(request).pipe(
             map(({ message }) => GroupChatMessagesActions.addMessage({ message })),
           ),
         ),
       ),
   )*!/

  sendMessageToUserSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserMessagesActions.sendMessageToUser),
        map(({ request }) => this.messagesService.sendMessageToUserSignalR(request)),
      ),
    { dispatch: false },
  )

  addMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserMessagesActions.addReceivedMessage),
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
        ofType(UserMessagesActions.updateMessage),
        switchMap(({ update }) => this.messagesService.updateMessage(update)),
      ),
    { dispatch: false },
  )

  updateManyMessages$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserMessagesActions.updateManyMessages),
        switchMap(({ updates }) => this.messagesService.updateManyMessages(updates)),
      ),
    { dispatch: false },
  )

  markAllMessagesAsReadWithUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UserMessagesActions.markAllMessagesAsReadWithUser),
        switchMap(({ recipient }) =>
          this.store
            .select(MessagesSelectors.selectAllMessages)
            .pipe(
              map((user-user-user-messages) =>
                user-user-user-messages.filter(
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
                return UserMessagesActions.updateManyMessages({ updates })
              }),
            ),
        ),
      ),
    // { dispatch: false },
  )
}
*/
