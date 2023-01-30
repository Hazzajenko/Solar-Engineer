import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'

import { map, switchMap } from 'rxjs/operators'
import { GroupChatsService } from '../api'
import { GroupChatMembersActions, GroupChatMessagesActions, GroupChatsActions } from '../store'
import {
  GroupChatMemberModel,
  GroupChatMessageModel,
  GroupChatModel,
  GroupChatServerMessageModel,
  InitialGroupChatMemberModel,
  MESSAGE_FROM,
} from '@shared/data-access/models'
import { notEmpty } from '@shared/utils'
import { GroupChatServerMessagesActions } from '../store/group-chat-server-messages/group-chat-server-messages.actions'
import { tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsEffects {
  private actions$ = inject(Actions)
  private groupChatsService = inject(GroupChatsService)
  private snackBar = inject(MatSnackBar)

  createGroupChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.createGroupChat),
      switchMap(({ request }) =>
        this.groupChatsService
          .createGroupChat(request)
          .pipe(map(({ groupChat }) => GroupChatsActions.addGroupChat({ groupChat }))),
      ),
    ),
  )

  inviteToGroupChat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatMembersActions.inviteGroupChatMembers),
      switchMap(({ request }) =>
        this.groupChatsService
          .inviteToGroupChat(request)
          .pipe(
            map(({ newMembers }) =>
              GroupChatMembersActions.addManyGroupChatMembers({ groupChatMembers: newMembers }),
            ),
          ),
      ),
    ),
  )
  /*
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
  */

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInSuccess),
      switchMap(() =>
        this.groupChatsService
          .getInitialCombinedGroupChats()
          .pipe(
            map((response) => GroupChatsActions.getInitialGroupChatCombinedResponse({ response })),
          ),
      ),
    ),
  )

  initGroupChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getInitialGroupChatCombinedResponse),
      map(({ response }) =>
        response.groupChats.map(
          (groupChat) =>
            ({
              id: groupChat.id,
              name: groupChat.name,
              photoUrl: groupChat.photoUrl,
              permissions: groupChat.permissions,
            } as GroupChatModel),
        ),
      ),
      map((groupChats) => GroupChatsActions.addManyGroupChats({ groupChats })),
    ),
  )
  /*  initGroupChats$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GroupChatsActions.getGroupChatData),
        map(({ groupChatData }) =>
          GroupChatsActions.addManyGroupChats({ groupChats: groupChatData.groupChats }),
        ),
      ),
    )*/

  initGroupChatMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getInitialGroupChatCombinedResponse),
      map(({ response }) =>
        response.groupChats
          .map((groupChat) =>
            groupChat.members.map(
              (member) =>
                ({
                  id: member.id,
                  groupChatId: groupChat.id,
                  userName: member.userName,
                  role: member.role,
                  joinedAt: member.joinedAt,
                } as InitialGroupChatMemberModel),
            ),
          )
          .flatMap((member) => member),
      ),
      // tap((res) => console.log('members', res)),
      map((groupChatMembers) =>
        GroupChatMembersActions.addManyGroupChatMembers({ groupChatMembers }),
      ),
    ),
  )
  /*  initGroupChatMembers$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GroupChatsActions.getGroupChatData),
        map(({ groupChatData }) =>
          GroupChatMembersActions.addManyGroupChatMembers({
            groupChatMembers: groupChatData.groupChatMembers,
          }),
        ),
      ),
    )*/

  initGroupChatMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getInitialGroupChatCombinedResponse),
      map(
        ({ response }) =>
          response.groupChats
            .map((groupChat) => groupChat.latestMessage)
            // .map(msg => ({ ...msg, messageFrom: MESSAGE_FROM[msg.messageFrom] } as GroupChatMessageModel))

            // .flatMap((f) => (f ? [f] : [])),
            .filter((x): x is GroupChatMessageModel => x !== null),
        // .flatMap((member) => member),
      ),
      map((groupChatMessages) =>
        GroupChatMessagesActions.addManyGroupChatMessages({
          groupChatMessages,
        }),
      ),
    ),
  )

  initGroupChatServerMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupChatsActions.getInitialGroupChatCombinedResponse),
      map(
        ({ response }) =>
          response.groupChats
            .map((groupChat) => groupChat.latestServerMessage)
            // .flatMap((f) => (f ? [f] : [])),
            .filter((x): x is GroupChatServerMessageModel => x !== null),
        // .flatMap((member) => member),
      ),
      map((groupChatServerMessages) =>
        GroupChatServerMessagesActions.addManyGroupChatServerMessages({
          groupChatServerMessages,
        }),
      ),
    ),
  )
  /*  initGroupChatMessages$ = createEffect(() =>
      this.actions$.pipe(
        ofType(GroupChatsActions.getGroupChatData),
        map(({ groupChatData }) =>
          GroupChatMessagesActions.addManyGroupChatMessages({
            groupChatMessages: groupChatData.groupChatMessages,
          }),
        ),
      ),
    )*/

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
