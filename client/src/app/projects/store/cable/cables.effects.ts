import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { CableStateActions } from './cable.actions'
import { switchMap } from 'rxjs'
import { CablesService } from '../../services/cables.service'
import { map } from 'rxjs/operators'
import { BlocksStateActions } from '../blocks/blocks.actions'
import { UnitModel } from '../../models/unit.model'

@Injectable()
export class CablesEffects {
  addCable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CableStateActions.addCableHttp),
        switchMap((action) =>
          this.cablesService.addCable(action.request).pipe(
            map(
              (res) => {
                this.store.dispatch(
                  CableStateActions.addCableToState({
                    cable: res.cable,
                  }),
                )
                this.store.dispatch(
                  BlocksStateActions.addBlockForGrid({
                    block: {
                      id: res.cable.location,
                      model: UnitModel.CABLE,
                      type: 'CABLE',
                      project_id: res.cable.project_id!,
                    },
                  }),
                )
              },
              // catchError(async (err) => console.log(err)),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )

  /*  addPanel$ = createEffect(() =>
      this.actions$
        .pipe(
        ofType(PanelStateActions.addPanel),
        exhaustMap((action) =>
          this.panelsService.addPanel(action.panel).pipe(
            map((panel) =>
              BlocksStateActions.addBlockForGrid({
                block: {
                  id: panel.location,
                  project_id: panel.project_id,
                  model: UnitModel.PANEL,
                },
              }),
            ),
            catchError((error) => console.log(error)),
            // catchError(error => of(AuthApiActions.loginFailure({ error })))
          ),
        ),
        /!* this.store.dispatch(BlocksStateActions.addBlockForGrid({block: action.panel})
   /!*      this.authService.login(action.credentials).pipe(
           map(user => AuthApiActions.loginSuccess({ user })),
           catchError(error => of(AuthApiActions.loginFailure({ error })))
         )*!/
       )
         mergeMap(() => this.store.dispatch(BlocksStateActions.addBlockForGrid({block: action.}))/!* this.moviesService.getAll()
           .pipe(
             map(movies => ({ type: '[Movies API] Movies Loaded Success', payload: movies })),
             catchError(() => EMPTY)
           )*!/)*!/
      ),
    )*/

  constructor(
    private actions$: Actions,
    private cablesService: CablesService,
    private store: Store<AppState>,
  ) {}
}
