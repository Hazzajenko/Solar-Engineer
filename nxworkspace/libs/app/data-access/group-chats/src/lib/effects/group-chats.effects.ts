import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'

import { map, switchMap } from 'rxjs/operators'
import { GroupChatsService } from '../api'
import { GroupChatMembersActions, GroupChatMessagesActions, GroupChatsActions } from '../store'
import { MessagesActions } from '@app/messages'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsEffects {
  private actions$ = inject(Actions)
  private groupChatsService = inject(GroupChatsService)
  private snackBar = inject(MatSnackBar)

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      switchMap(() =>
        this.groupChatsService
          .getAllGroupChats()
          .pipe(map((groupChatData) => GroupChatsActions.getGroupChatData({ groupChatData }))),
      ),
    ),
  )
  initGroupChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getGroupChatData),
      map(({ groupChatData }) =>
        GroupChatsActions.addManyGroupChats({ groupChats: groupChatData.groupChats }),
      ),
    ),
  )
  initGroupChatMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getGroupChatData),
      map(({ groupChatData }) =>
        GroupChatMembersActions.addManyGroupChatMembers({
          groupChatMembers: groupChatData.groupChatMembers,
        }),
      ),
    ),
  )
  initGroupChatMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getGroupChatData),
      map(({ groupChatData }) =>
        GroupChatMessagesActions.addManyGroupChatMessages({
          groupChatMessages: groupChatData.groupChatMessages,
        }),
      ),
    ),
  )

  initMessagesConnectionWithGroupChat$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupChatsActions.initGroupChat),
        map(({ groupChatId }) =>
          this.groupChatsService.getMessagesWithGroupChatSignalR(groupChatId),
        ),
      ),
    { dispatch: false },
  )

  sendMessageToGroupChatSignalR$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupChatMessagesActions.sendMessageToGroupChat),
        map(({ request }) => this.groupChatsService.sendMessageToGroupChatSignalR(request)),
      ),
    { dispatch: false },
  )

  addGroupChatMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GroupChatMessagesActions.addGroupChatMessage),
        map(({ groupChatMessage }) => {
          const messageFrom = groupChatMessage.senderUserName
          this.snackBar.open(`New message from ${messageFrom}!`, 'OK', {
            duration: 5000,
          })
        }),
      ),
    { dispatch: false },
  )
}
