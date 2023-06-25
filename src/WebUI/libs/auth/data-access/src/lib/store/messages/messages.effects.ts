import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { MessagesSignalrService } from '../../signalr'
import { MessagesActions } from '@auth/data-access'

export const sendMessageToUser$ = createEffect(
	(actions$ = inject(Actions), messagesSignalR = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.sendMessageToUser),
			tap(({ request }) => {
				messagesSignalR.sendMessageToUser(request)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const fetchMessagesByUserId$ = createEffect(
	(actions$ = inject(Actions), messagesSignalR = inject(MessagesSignalrService)) => {
		return actions$.pipe(
			ofType(MessagesActions.fetchMessagesByUserId),
			tap(({ request }) => {
				messagesSignalR.getMessagesWithUser(request)
			}),
		)
	},
	{ functional: true, dispatch: false },
)
