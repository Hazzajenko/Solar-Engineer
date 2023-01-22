import { inject, Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthActions } from '@auth/data-access/store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'

import { map, switchMap } from 'rxjs/operators'
import { GroupChatsService } from '../api'
import { GroupChatsActions } from '../store'

@Injectable({
  providedIn: 'root',
})
export class GroupChatsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private groupChatsService = inject(GroupChatsService)
  private snackBar = inject(MatSnackBar)
  initGroupChats$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signInSuccess),
        switchMap(() =>
          this.groupChatsService.getAllGroupChats().pipe(
            map(({ groupChats }) => GroupChatsActions.addManyGroupChats({ groupChats })),
          ),
        ),
      ),
  )
}
