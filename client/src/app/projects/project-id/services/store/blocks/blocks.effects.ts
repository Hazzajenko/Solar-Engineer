import { PanelLinksEntityService } from '../../ngrx-data/panel-links-entity/panel-links-entity.service'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { BlocksStateActions } from './blocks.actions'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { ObservableService } from '../../observable.service'
import { RailsEntityService } from '../../ngrx-data/rails-entity/rails-entity.service'
import { PanelsHelperService } from '../../ngrx-data/panels-entity/panels.service'
import { selectBlocksByProjectIdRouteParams } from './blocks.selectors'
import { selectCurrentProjectId } from '../projects/projects.selectors'
import { TypeModel } from '../../../../models/type.model'

@Injectable()
export class BlocksEffects {
  deleteManyBlocks = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BlocksStateActions.deleteManyBlocksForGrid),
        map(async (action: any) => {
          // let blocks: string[] = action.blockIds
          const blockIds: string[] = action.blockIds
          // const blocks: BlockModel[] = data?.filter((d) => blockIds?.includes(d.id))
          const projectId = await firstValueFrom(this.store.select(selectCurrentProjectId))
          const isTherePanels = await firstValueFrom(
            this.store
              .select(selectBlocksByProjectIdRouteParams)
              .pipe(map((blocks) => blocks.filter((block) => block.type === TypeModel.PANEL))),
          )
          if (isTherePanels) {
            const panelIds = await firstValueFrom(
              this.panelsEntity.entities$.pipe(
                map((panels) =>
                  panels.filter((panel) => blockIds.includes(panel.id)).map((panel) => panel.id),
                ),
              ),
            )
            await lastValueFrom(
              this.http.delete(`/api/projects/${projectId}/panels`, {
                body: {
                  panelIds,
                },
              }),
            )
          }
          /*          const blocks: BlockModel[] = await firstValueFrom(
                      this.store
                        .select(selectBlocksByProjectIdRouteParams)
                        .pipe(map((blocks) => blocks.filter((block) => !blockIds.includes(block.id)))),
                    )*/
          /*const panelBlocks: string[] = blocks
            .filter((b) => b.type === TypeModel.PANEL)
            .map((block) => block.id)
          if (panelBlocks) {
            await lastValueFrom(
              this.http.delete(`/api/projects/${projectId}/panels`, {
                body: {
                  panelIds: panelBlocks,
                },
              }),
            )
          }*/
          // .pipe(map((blocks) => blocks.filter((block) => blockIds.includes(block.id)))),

          /*            const filteredArray = blocks.filter(function (array_el) {
                          return (
                            blockIds.filter(function (anotherOne_el) {
                              return anotherOne_el == array_el.id
                            }).length == 0
                          )
                        })*/
          // },
          /*this.store.select(selectAllBlocks).pipe(
              map((data: BlockModel[]) => {
                // let blocks: string[] = action.blockIds
                const blockIds: string[] = action?.blockIds
                const blocks: BlockModel[] = data?.filter((d) => blockIds?.includes(d.id))
                // const projectId = await firstValueFrom(this.store.select(selectCurrentProjectId))

                const panelBlocks: string[] = blocks
                  .filter((b) => b.type === TypeModel.PANEL)
                  .map((block) => block.id)

                /!*              if (panelBlocks) {
                                await lastValueFrom(
                                  this.http.delete(`/api/projects/${projectId}/panels`, {
                                    body: {
                                      panelIds: panelBlocks,
                                    },
                                  }),
                                )
                              }*!/

                /!*  const panelRails = blocks
                   .filter((b) => b.type === TypeModel.RAIL)
                   .map((block) => block.id)

              /!*if (panelRails.length > 0) {
                   firstValueFrom(
                     this.observablesService
                       .getItemFromIncludedIdArray(TypeModel.RAIL, panelRails)
                       .pipe(
                         switchMap((rails: RailModel[]) =>
                           this.http.delete(`/api/projects/${projectId}/rails`, {
                             body: {
                               rails,
                             },
                           }),
                         ),
                       ),
                   ).then((res) => {
                     console.log(res)
                   })
                 }*!/
              }),
            ),*/
        }),
      ),
    { dispatch: false },
  )

  /*  let blocks: BlockModel[] = action.blocks
    const panels = blocks.filter((b) => b.model === UnitModel.PANEL)
    if (panels.length > 0) {
    lastValueFrom(
      this.http.delete()
  )
  }*/

  /*  finishMultiCreatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(MultiActions.finishMultiCreatePanel),
          switchMap((action) =>
            this.panelJoinsEntity.entities$.pipe(
              map((res) => {
                const panelLink: PanelLinksToModel = getSelectedLinks(
                  res,
                  action.panelId,
                )
                this.store.dispatch(
                  SelectedStateActions.setSelectedPanelLinks({ panelLink }),
                )
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelJoinsEntity: PanelLinksEntityService,
    private panelsEntity: PanelsEntityService,
    private panelsService: PanelsHelperService,
    private stringsEntity: StringsEntityService,
    private railsEntity: RailsEntityService,
    private statsService: StatsService,
    private observablesService: ObservableService,
    private store: Store<AppState>,
    private http: HttpClient,
  ) {}
}
