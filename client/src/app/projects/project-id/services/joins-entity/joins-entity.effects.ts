import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { PanelsService } from '../../../services/panels.service'
import { JoinsEntityService } from './joins-entity.service'

@Injectable()
export class JoinsEntityEffects {
  /* addCable$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(`${DataEntities.Cable} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
         tap((action: any) => {
           const cable = action.payload.data
           this.store.dispatch(
             BlocksStateActions.addBlockForGrid({
               block: {
                 id: cable.id,
                 location: cable.location,
                 model: UnitModel.CABLE,
                 type: 'CABLE',
                 project_id: cable.project_id!,
                 color: cable.color,
               },
             }),
           )
         }),
       ),
     { dispatch: false },
   )
   getAllCables$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(`${DataEntities.Cable} ${EntityOp.QUERY_ALL_SUCCESS}`),
         tap((action: any) => {
           const blocks: BlockModel[] = action.payload.data.map(
             (cable: CableModel) => {
               const block: BlockModel = {
                 id: cable.id,
                 location: cable.location,
                 model: UnitModel.CABLE,
                 type: 'CABLE',
                 project_id: cable.project_id!,
                 color: cable.color,
               }
               return block
             },
           )
           this.store.dispatch(
             BlocksStateActions.addManyBlocksForGrid({
               blocks,
             }),
           )
         }),
       ),
     { dispatch: false },
   )
   updateOneCable$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(`${DataEntities.Cable} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
         tap((action: any) => {
           console.log(action)
           const data = action.payload.data
           this.store.dispatch(
             BlocksStateActions.updateBlockForGrid({
               block: {
                 id: data.id,
                 location: data.changes.location,
                 model: UnitModel.CABLE,
                 type: 'CABLE',
                 project_id: data.changes.project_id!,
               },
             }),
           )
         }),
       ),
     { dispatch: false },
   )
   deleteCable$ = createEffect(
     () =>
       this.actions$.pipe(
         ofType(`${DataEntities.Cable} ${EntityOp.SAVE_DELETE_ONE}`),
         tap((action: any) => {
           const data = action.payload.data
           this.store.dispatch(
             BlocksStateActions.deleteBlockForGrid({
               block_id: data,
             }),
           )
         }),
       ),
     { dispatch: false },
   )*/

  /*  updatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelStateActions.updatePanelHttp),
          exhaustMap((action) =>
            this.panelsService.updatePanel(action.request).pipe(
              map(
                (res) => {
                  console.log(res)
                  this.store.dispatch(
                    PanelStateActions.updatePanelToState({
                      panel: res.panel,
                    }),
                  )
                  this.store.dispatch(
                    BlocksStateActions.updateBlockForGrid({
                      oldLocation: action.request.panel.location,
                      block: {
                        id: res.panel.location,
                        model: UnitModel.PANEL,
                        type: 'PANEL',
                        project_id: res.panel.project_id!,
                      },
                    }),
                  )
                  console.log(res)
                },
                // catchError(async (err) => console.log(err)),
              ),
              catchError(async (error) => console.log(error)),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: JoinsEntityService,
    private store: Store<AppState>,
  ) {}
}
