import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { tap } from 'rxjs'
import { UsersActions } from '@users/data-access'
import { UsersSignalrService } from '@auth/data-access'

export const searchForUsers$ = createEffect(
	(actions$ = inject(Actions), usersSignalr = inject(UsersSignalrService)) => {
		return actions$.pipe(
			ofType(UsersActions.searchForAppUserByUserName),
			tap(({ query }) => {
				usersSignalr.searchForAppUserByUserName(query)
			}),
		)
	},
	{ functional: true, dispatch: false },
)
