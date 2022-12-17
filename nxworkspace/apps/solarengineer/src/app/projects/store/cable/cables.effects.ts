import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { CableStateActions } from './cable.actions'
import { exhaustMap, switchMap } from 'rxjs'
import { CablesService } from '../../services/cables.service'
import { catchError, map } from 'rxjs/operators'
import { BlocksStateActions } from '../../project-id/services/store/blocks/blocks.actions'
import { TypeModel } from '../../../../../../../libs/shared/data-access/models/src/lib/type.model'

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
                      id: res.cable.id,
                      location: res.cable.location,
                      type: TypeModel.CABLE,
                      projectId: res.cable.project_id!,
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
  updateCable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CableStateActions.updateCableHttp),
        exhaustMap((action) =>
          this.cablesService.updateCable(action.request).pipe(
            map((res) => {
              this.store.dispatch(
                CableStateActions.updateCableToState({
                  cable: res.cable,
                }),
              )
              this.store.dispatch(
                BlocksStateActions.updateBlockForGrid({
                  // oldLocation: action.request.cable.location,
                  block: {
                    id: res.cable.id,
                    location: res.cable.location,
                    type: TypeModel.CABLE,
                    projectId: res.cable.project_id!,
                  },
                }),
              )
            }),
            catchError(async (error) => console.log(error)),
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
